(async () => {

    // fetching popup contents

    const POPUP_ID_PREFIX = 'popup-id-';
    const PRELOAD_CLASS = 'popup-preload';

    const extractNumberFromClass = className => {
        if (!className.startsWith(POPUP_ID_PREFIX)) {
            return null;
        }
        const id = parseInt(className.substring(POPUP_ID_PREFIX.length));
        return !isNaN(id) ? id : null;
    };
    const actualTriggerElement = el => {
        const tagName = el.tagName.toLowerCase();
        const possibleTriggers = ['a', 'button'];
        if (possibleTriggers.includes(tagName)) { return el }
        return el.querySelector(possibleTriggers.join(',')) || el;
    };

    let triggers = [];
    const getTriggers = () => {
        triggers = [];
        const triggerElements = document.querySelectorAll(`[class*="${POPUP_ID_PREFIX}"]`);

        triggerElements.forEach(element => {
            const classList = element.classList;
            const isPreload = classList.contains(PRELOAD_CLASS);
            const actualElement = actualTriggerElement(element);

            classList.forEach(className => {
                const id = extractNumberFromClass(className);
                if (id !== null) {
                    triggers.push({
                        id,
                        isPreload,
                        element, // works as parent if has button or a child
                        actualElement
                    });
                }
            });
        });

        return triggers;
    };

    let contentStorage = [];
    const fetchContent = async ids => {
        const param = Array.isArray(ids) ? ids.join(',') : String(ids);

        try {
            const response = await fetch(`/wp-json/fct/popups/v1/${param}`, {
                method: 'get'
            });

            if (response.status === 200) {
                const data = await response.json();
                return data || [];
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }

        return [];
    };

    const getContent = async ids => {
        if (!ids) { return }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const missingIds = ids.filter(id => !contentStorage.some(item => item.id === id));

        if (missingIds.length > 0) {
            const fetchedContent = await fetchContent(missingIds);
            contentStorage.push(...fetchedContent);
        }

        return contentStorage.filter(item => ids.some(id => item.id === id));
    };

    const preload = async () => {
        const triggers = getTriggers();
        const preloadTriggers = triggers.filter(trigger => trigger.isPreload);

        if (preloadTriggers.length > 0) {
            const preloadIds = preloadTriggers.map(trigger => trigger.id);
            await getContent(preloadIds);
        }
    };

    await preload();


    // popup wrapper

    // spread click events
    let currentTrigger = null;
    const closePopup = e => {
        e?.preventDefault();
        currentTrigger?.setAttribute('aria-expanded', 'false');
        currentTrigger = null;
        document.removeEventListener('keydown', escPress);
        deleteModal();
    };
    const escPress = e => {
        if (e.code === 'Escape') {
            e.preventDefault();
            closePopup();
        }
    };

    triggers.forEach(trigger => {
        const el = trigger.actualElement;

        const openPopup = e => {
            closePopup();
            e.preventDefault();
            el.setAttribute('aria-expanded', 'true');
            currentTrigger = el;
            document.addEventListener('keydown', escPress);
            makeModal(trigger.id);
            //setTimeout(() => { document.addEventListener('click', closePopup ) });
        };

        el.setAttribute('aria-haspopup', 'true');
        el.setAttribute('aria-expanded', 'false');
        el.setAttribute('aria-label', 'Popup');
        el.addEventListener('click', openPopup);
    });

    // create the popup modal / dialog
    let dialog, closeBack;
    const bodyStyle = document.body.style;
    const makeModal = async id => {

        // create the modal
        dialog = document.createElement('div');
        dialog.className = 'popup-modal hidden';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('tabindex', '-1');

        // get the content
        const data = await getContent(id);
        const content = data?.length && data[0];
        if (content.id !== id) {
            console.error('Popup not found', id);
            return;
        }

        // print the content details
        dialog.setAttribute('aria-label', content.title);
        dialog.innerHTML = content.content;

        // show the modal
        const parent = document.querySelector('main#main');
        parent.insertAdjacentElement('beforeend', dialog); // ++ can add the loader inside the div if it is created nd shown before async
        setTimeout(()=>{ dialog.className = 'popup-modal' });

        // add the close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = content.close_label;
        closeButton.setAttribute('aria-label', content.close_label);
        closeButton.addEventListener('click', closePopup);
        closeButton.tabIndex = 0;
        dialog.appendChild(closeButton);

        // add the close button
        const closeX = document.createElement('button');
        closeX.className = 'close-x';
        closeX.setAttribute('aria-label', content.close_label);
        closeX.addEventListener('click', closePopup);
        closeX.tabIndex = 0;
        dialog.appendChild(closeX);

        // add the close background
        closeBack = document.createElement('button');
        closeBack.className = 'popup-modal-close-back';
        closeBack.addEventListener('click', closePopup);
        closeBack.tabIndex = -1;
        parent.insertAdjacentElement('beforeend', closeBack);

        // stop scrolling
        bodyStyle.overflow = 'hidden';
        bodyStyle.setProperty( 'touch-action', 'none' ); // for safari to not scroll the body
    };

    const deleteModal = () => {
        dialog?.remove();
        closeBack?.remove();
        // restore scrolling
        bodyStyle.overflow = null;
        bodyStyle.removeProperty( 'touch-action' );
    };

})();
