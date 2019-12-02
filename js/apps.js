function App(name, script) {
    this.name = name;
    this.script = script;
    this.memory = [];
}

var packages = {

    post: {
        commands: {
            run: function (val) {
                this.notes(val);
            },

            notes: function (val) {
                if (val == "modify-text") {
                    cards.memory[cards.count] = { activeCount: 0, innerText: "" };
                    var textAreaStyle = `
                                <style>
                                    textarea, p {
                                        resize: none;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                    }

                                    p {
                                        top: 18px;
                                        left: 8px;
                                        width: 96%;
										height: 90%;
										border: 1px solid black;
                                        overflow-y: scroll;
                                    }

                                    #edit-pane-open-`+ cards.count + ` {
                                        z-index: `+ cards.memory[cards.count].activeCount + `;
                                    }
                                </style>
                            `;// <p id='card-text-`+ cards.count +`' class='noselect'></p>

                    $("#" + cards.count).append(`
					`+ textAreaStyle + `<textarea></textarea>
                    <i id='edit-pane-open-` + cards.count + `' class='fas fa-edit' style='position: absolute; right: 8px; bottom: 8px; cursor: pointer; color: gray; font-size: 12px;'></i>`);

                    //$("#card-text-"+ cards.count).hide();
                    $("#" + cards.count + " textarea").hide();

                    $("#edit-pane-open-" + cards.count).click(function (e) {
                        targetId = e.target.parentElement.id;

                        if (targetId == "card-area") { // Checks to see if targetId is looking at parent id.
                            targetId = e.target.id;
                        }

                        if (cards.memory[targetId].activeCount % 2 === 0) {

                            //$("#card-text-"+ targetId).hide();
                            $("#" + targetId + " textarea").show();
                            $("#edit-pane-open-" + targetId).removeClass("fas fa-edit");
                            $("#edit-pane-open-" + targetId).addClass("fas fa-save");

                        } else {

                            //$("#card-text-"+ targetId).show();
                            $("#" + targetId + " textarea").hide();
                            $("#edit-pane-open-" + targetId).removeClass("fas fa-save");
                            $("#edit-pane-open-" + targetId).addClass("fas fa-edit");

                        }

                        $("#inner-card-" + targetId).html($("#" + targetId + " textarea").val().replace(/\n/g, "<br />"));

                        cards.memory[targetId].activeCount++;
                    });
                }
            }
        },


    },

    run: function (val) {
        console.log(val);
        val = this.YouTube.replaceUrl(val);
        val = this.RSS.replaceUrl(val);
        console.log(val);
        return val;
    },

    YouTube: {
        replaceUrl: function (url) {
            if (url.search("youtube.com") > 0) {
                return url.replace("watch?v=", "embed/");
            }

            return url;
        }
    },

    RSS: {
        replaceUrl: function (url) {
            if (url.search(".rss") > 0) {
                var output = "";
                var xml = "";

                const proxyurl = "https://cors-anywhere.herokuapp.com/";

                const request = async () => {
                    await fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
                        .then(response => response.text())
                        .then(contents => xml = contents)
                        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
                    console.log("Done");

                    $(xml).find('entry').each(function () {
                        $(this).find("content").each(function () {
                            output += $(this).text();
                        });
                    });
                    $("#" + cards.count + 1).append("HELLO");
                    console.log(cards.count);
                    console.log(output);
                }

                request();

                console.log("p");



                return "";
            }
            return url;
        }
    }
}

var apps = [

];

function getAppByName(_name) {
    for (x = 0; x < apps.length; x++) {
        if (apps[x].name === _name) {
            return x;
        }
    }
}

// CREATE APPS

apps.push(new App("<i class='fas fa-file-alt'></i> Text", `
    Create Card
    {
        <script>
        post command modify-text
        </script>
    }
`));

apps.push(new App("<i class='fas fa-cogs'></i> Automation", `
    Create Card
    {
        
    }
`));

apps.push(new App("<i class='far fa-sticky-note'></i> Notepad", `
    Create Card
    {
        <textarea></textarea>
    }
`));

apps.push(new App("<i class='fab fa-youtube'></i> YouTube", `
    Create Card
    {
        <iframe width="560" height="315" src="
        prompt Enter YouTube Video Link
        " frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    }
`));

apps.push(new App("<i class='fas fa-rss-square'></i> RSS", `
    Create Card
    {
        prompt Enter RSS URL
    }
`));

apps.push(new App("<i class='fas fa-globe'></i> Website", `
    Create Card
    {
        <iframe src="
        prompt Enter URL
        "></iframe>
    }
`));