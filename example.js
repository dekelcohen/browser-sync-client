var bs     = require("browser-sync").create();
var client = require("./");

client["plugin:name"] = "client:script";

bs.use(client);

bs.init({
    proxy: 'https://www.robustico.com:443',
    open: false,
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: true,
        mouse: true
    },

    clientEvents: [
        "scroll",
        "scroll:element",
        "input:text",
        "input:toggles",
        "form:submit",
        "form:reset",
        "click",
        "mousedown",
        "mouseup"
    ],
    //files: ['test/fixtures'],
    // server: {
    //     baseDir: ["test/fixtures"]
    // },
    
    //minify: false
    //snippetOptions: {
    //    rule: {
    //        match: /SHNAE/,
    //        fn: function (snippet) {
    //            return snippet + "\n</body>";
    //        }
    //    }
    //}
});

