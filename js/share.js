(function () {
    var shareButton = document.getElementById('share-button');
    var shareFeedback = document.getElementById('share-feedback');

    if (!shareButton || !shareFeedback) {
        return;
    }

    var canonicalUrl = 'https://abovethefold.fyi/';
    var shareData = {
        title: document.title,
        text: 'Come for the URL, stay for the message.',
        url: canonicalUrl
    };
    var feedbackTimeoutId;

    function setFeedback(message) {
        shareFeedback.textContent = message;

        window.clearTimeout(feedbackTimeoutId);
        feedbackTimeoutId = window.setTimeout(function () {
            shareFeedback.textContent = '';
        }, 2000);
    }

    function copyLinkFallback() {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            setFeedback('Unable to share');
            return Promise.resolve();
        }

        return navigator.clipboard.writeText(canonicalUrl)
            .then(function () {
                setFeedback('Link copied');
            })
            .catch(function () {
                setFeedback('Unable to copy link');
            });
    }

    shareButton.addEventListener('click', function () {
        if (navigator.share) {
            navigator.share(shareData)
                .then(function () {
                    setFeedback('Shared');
                })
                .catch(function (error) {
                    if (error && error.name === 'AbortError') {
                        return;
                    }

                    copyLinkFallback();
                });
            return;
        }

        copyLinkFallback();
    });
})();
