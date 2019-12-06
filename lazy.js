/**
 * Cross-browser lazy loading library compatible with "loading" attribute.
 *
 * Simple image:
 * <img loading="lazy" data-src="" src="" ... />
 *
 * With picture:
 * <picture>
 *    <source data-srcset="" .../>
 *    <img loading="lazy" data-src="" src="" ... />
 * </picture>
 */
document.addEventListener('DOMContentLoaded', function(){

    var active = false;
    var elements = document.querySelectorAll('[loading]');
        elements = [].slice.call(elements);

    /**
     * Update element attributes
     * @param {Node} element
     * @return {void}
     */
    function updateElement(element){

        if( element.dataset.src ){
            element.src = element.dataset.src;
        }
        if( element.dataset.srcset ){
            element.srcset = element.dataset.srcset;
        }
        if( element.dataset.sizes ){
            element.sizes = element.dataset.sizes;
        }

        element.classList.remove('lazy');

    }

    /**
     * Load element
     * @param {Node} element
     * @return {void}
     */
    function loadElement(element){

        updateElement(element);

        // Process sibling <source/> element
        var child = element.parentElement.querySelectorAll('source');
            child = [].slice.call(child);

        if( !child.length ){
            return;
        }

        child.forEach(function(childElement){
            updateElement(childElement);
        });

    }

    /**
     * Return if element is in viewport
     * @param {Node} element
     * @return {Boolean}
     */
    function isInViewport(element){
        return ( element.getBoundingClientRect().top <= window.innerHeight
                && element.getBoundingClientRect().bottom >= 0 )
                && getComputedStyle(element).display !== 'none';
    }

    /**
     * Process and load elements
     * @return {void}
     */
    function processElements(){

        if( elements.length === 0 ){
            return;
        }

        elements.forEach(function(element){
            if( isInViewport(element) ){

                loadElement(element);
                elements = elements.filter(function(theElement) {
                    return element !== theElement;
                });

            }
        });

    }

    /**
     * Lazy load elements
     * @return {void}
     */
    function lazyLoad(){

        if( active ){
            return;
        }

        active = true;
        window.setTimeout(function(){

            processElements();

            if( elements.length === 0 ){
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
            }

            active = false;

        }, 200);

    }

    if( 'loading' in HTMLImageElement.prototype ){
        elements.forEach(loadElement);
    }else{
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        lazyLoad();
    }

});