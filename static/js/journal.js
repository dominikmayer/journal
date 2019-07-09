window.addEventListener('load', function() {
    var containers = document.getElementsByClassName("journalize");
    for (container of containers) {
        container.addEventListener('ia-writer-change', styleContent);
        container.dispatchEvent(new Event('ia-writer-change'));
    }
});

    function styleContent() {
        var text = this.innerHTML;
        console.log(text);
        text = cleanContent(text);
        text = styleDream(text);
        text = styleShortcodeImages(text);
        text = removeComments(text);
        text = styleDialogs(text);
        text = createImages(text, this.dataset.url);
        this.innerHTML = text;
    };

    function styleDream(input) {
        var text = input.replace(/<p>{{&lt; dream &gt;}}<\/p>/g, '<article class="message is-primary sensitive"><div class="message-body">');
        text = text.replace(/<p>{{&lt;\/ dream &gt;}}<\/p>/g, '</div></article>');
        return text;
    };

    function styleShortcodeImages(input) {
        var text = input.replace(/{{&lt; image ["“]/g, '<img src="');
        text = text.replace(/["”] &gt;}}/g, '">');

        text = text.replace(/<p>{{&lt; images &gt;}}<\/p>/g, '');
        text = text.replace(/<p>{{&lt;\/ images &gt;}}<\/p>/g, '');

        return text;
    };

    function styleDialogs(input) {
        var text = input.replace(/(?:(?:<p>\..*?<\/p>\n+)+|<p>{{&lt; dialog &gt;}}<\/p>.*<p>{{&lt;\/ dialog &gt;}}<\/p>)/gs, createDialog)

        return text;
    };

    function createDialog(match) {
        var text = match.replace(/<p>{{&lt;\/? dialog &gt;}}<\/p>/g, '');
        text = text.replace(/(?:<p>)?\.?(\w.*?)\s?(\(.*\))?:(.*?)(?:<\/p>|<br>)/g, createDialogLine);

        return '<article class="message is-dark sensitive"><div class="message-body">' + text  + '</div></article>';
    };

    function createDialogLine(match, speaker, comment, text) {
        var output = "<b>" + speaker;
        if (comment) {
            output = output + "</b>" + " <i>" + comment + ":</i>"
        } else {
            output = output + ":</b>"
        }
        output = output + text + "</br>";
        return output;
    };

    function createImages(input, url) {
        var text = input;

        // Adding the figure environment in Hugo
        text = text.replace(/(?:(?:<p>)?(?:\/.*\.(?:jpeg|jpg|gif|png|heic))(?:<\/p>|<br>)\n?)+/gi, createFigure);

        // Adding the figure environment in iA Writer
        text = text.replace(/(?:<figure>.*?<\/figure>\n*)+/gis, createFigure);

        // Adding the images
        text = text.replace(/(?:<p>)?\/((.*)\.(jpeg|jpg|gif|png|heic))(?:<\/p>|<br>)/gi, '<div><img src="' + encodeURI(url) + '/$1" class="entry-image" title="$2"></div>');
        return text;
    };

    function createFigure(match) {
        var numberOfImages = countImages(match);
        var gridClass = '';
        if (numberOfImages > 1) {
            gridClass = ' image-grid';
        }
        return '<figure class="sensitive' + gridClass + '">' +  match + '</figure>';
    };

    function removeComments(input) {
        return input.replace(/{{&lt; comment &gt;}}.*?{{&lt;\/ comment &gt;}}/gs, '');
    };

    function cleanContent(input) {
        var text = input.replace(/<p><\/p>/g, '');
        return text;
    };

    const countImages = (str) => {
        const re = /(jpeg|jpg|gif|png|heic)/gi
        return ((str || '').match(re) || []).length
    };
