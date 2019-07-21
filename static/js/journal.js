if (env == "iA") {
    window.addEventListener('load', addListeners);
} else {
    window.addEventListener('DOMContentLoaded', addListeners);
}

var meInDialogs = ["Ich", "I", "Me"];

    function addListeners() {
        var containers = document.getElementsByClassName("journalize");
        for (container of containers) {
            container.addEventListener('ia-writer-change', styleContent);
            container.dispatchEvent(new Event('ia-writer-change'));
        }
        if (env != "iA") {
            addZoom();
        }
    }

    function styleContent() {
        var text = this.innerHTML;
        // console.log(text);
        text = cleanContent(text);
        text = styleDream(text);
        text = styleShortcodeImages(text);
        text = createTodos(text);
        text = removeComments(text);
        text = styleDialogs(text);
        text = createMedia(text, this.dataset.url);
        this.innerHTML = text;

        if (env == "iA") {
            addZoom();
        }
    };

    function styleDream(input) {
        var dreamTitle = "Dream";
        if (navigator.language == "de-DE") {
            dreamTitle = "Traum";
        }

        var dreamHtml = '<article class="message is-primary sensitive"><div class="message-header"><p>' + dreamTitle + '</p></div><div class="message-body">$1</div></article>'

        var text = input.replace(/^<p>{{&lt; dream &gt;}}<\/p>(.*?)<p>{{&lt;\/ dream &gt;}}<\/p>$/gms, dreamHtml);

        text = text.replace(/<p>§§§<(?:\/p|br)>(.*?)(?:<p>)?§§§<\/p>/gms, dreamHtml);

        return text;
    };

    function styleShortcodeImages(input) {
        var text = input;
        text = text.replace(/<p>{{&lt; images &gt;}}<\/p>/g, '');
        text = text.replace(/<p>{{&lt;\/ images &gt;}}<\/p>/g, '');

        return text;
    };

    function styleDialogs(input) {
        var text = input.replace(/(?:(?:<p>\..*?<\/p>(?:\n+|$))+|<p>{{&lt; dialog &gt;}}<\/p>.*<p>{{&lt;\/ dialog &gt;}}<\/p>)/gs, createDialog)

        return text;
    };

    function createDialog(match) {
        var text = match.replace(/<p>{{&lt;\/? dialog &gt;}}<\/p>/g, '');
        var speakers = [];

        text = text.replace(/(?:<p>)?\.?(\w.*?)\s?(\(.*\))?:(.*?)(?:<\/p>|<br>)/g, function(match, speaker, comment, text) {
            var newSpeaker = false;
            if (!speakers.includes(speaker)) {
                newSpeaker = true;
                speakers.push(speaker);
            }
            return createDialogLine(match, speaker, comment, text, speakers, newSpeaker);
        });
        console.log(speakers);

        return '<ul class="journal-dialog">' + text  + '</ul>\n';
    };

    function createDialogLine(match, speaker, comment, text, speakers, newSpeaker) {
        var output = "";

        var whoseDialog = "their-dialog";
        if (meInDialogs.includes(speaker) || (speaker != speakers[0] && !meInDialogs.includes(speakers[0]))) {
            whoseDialog = "my-dialog";
        }

        if (comment) {
            output = "<b>" + speaker + "</b>" + " <i>" + comment + "</i><br>"
        } else if (newSpeaker) {
            output = "<b>" + speaker + "</b><br>"
        }
        output = '<li class="' + whoseDialog + '">' + output + text + "</li>";

        return output;
    };

    function createMedia(input, url) {
        var text = input;

        let photoExtensions = 'jpeg|jpg|gif|png|heic';
        let videoExtensions = 'mov|mp4';

        // Adding the figure environment in Hugo
        let figureRegex = new RegExp('(?:(?:<p>)?(?:\/.*\.(?:' + photoExtensions + '|' + videoExtensions + '))(?:<\/p>|<br>)\n?)+',"gi");
        text = text.replace(figureRegex, createFigure);

        // Adding the figure environment in iA Writer
        text = text.replace(/(?:<figure>.*?<\/figure>\n*)+/gis, createFigure);

        // Adding the images
        let photoRegex = new RegExp('(?:<p>)?\/((.*)\.(' + photoExtensions + '))(?:<\/p>|<br>)', 'gi')
        text = text.replace(photoRegex, '<div><img src="' + url + '/$1" class="entry-image" title="$2"></div>');

        // Adding the videos
        let videoRegex = new RegExp('(?:<p>)?\/((.*)\.(' + videoExtensions + '))(?:<\/p>|<br>)', 'gi')
        text = text.replace(videoRegex, '<div><video controls title="$2"><source src="' + url + '/$1" type="video/mp4">Your browser does not support the video tag.</video></div>');
        //text = text.replace(videoRegex, '<div><img src="' + url + '/$1" class="entry-image" title="$2"></div>');

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

    function createTodos(input) {
        return input.replace(/<p>\+\+<(?:\/p|br)>\n(.*?)(?=<p>\/\/\/<\/p>|$)/gs, '<article class="message is-warning">\n<div class="message-header">\n<p>To Do</p>\n</div>\n<div class="message-body">\n$1\n</div>\n</article>\n\n');
    };

    function removeComments(input) {
        var text = input.replace(/{{&lt; comment &gt;}}.*?{{&lt;\/ comment &gt;}}/gs, '');
        text = text.replace(/^<p>\/\/\/<(?:\/p|br)>.*$/gms, '');

        return text;
    };

    function cleanContent(input) {
        var text = input.replace(/<p><\/p>/g, '');
        return text;
    };

    const countImages = (str) => {
        const re = /(jpeg|jpg|gif|png|heic)/gi
        return ((str || '').match(re) || []).length
    };

    function addZoom() {
        const zoom = mediumZoom('img', {
            background: "#000000",
        });

        let mainNav = document.getElementById("main-nav");

        if (mainNav) {
            zoom.on('closed', event => {
                mainNav.style.display = "flex";
            });
            zoom.on('open', event => {
                mainNav.style.display = "none";
            });
        }
    };
