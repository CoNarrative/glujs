/*
 * Copyright (C) 2012 by CoNarrative
 */
(function () {
    var boyFirstNames = "Michael,Christopher,Jason,David,James,Matthew,Joshua,John,Robert,Joseph,Daniel,Brian,Justin,William,Ryan,Eric,Nicholas,Jeremy,Andrew,Timothy,Jonathan,Adam,Kevin,Anthony,Thomas,Richard,Jeffrey,Steven,Charles,Brandon,Mark,Benjamin,Scott,Aaron,Paul,Nathan,Travis,Patrick,Chad,Stephen,Kenneth,Gregory".split(",");
    var girlFirstNames = "Jennifer,Amanda,Jessica,Melissa,Sarah,Heather,Nicole,Amy,Elizabeth,Michelle,Kimberly,Angela,Stephanie,Tiffany,Christina,Lisa,Rebecca,Crystal,Kelly,Erin,Laura,Amber,Rachel,Jamie,April,Mary,Sara,Andrea,Shannon,Megan,Emily,Julie,Danielle,Erica,Katherine,Maria,Kristin,Lauren,Kristen,Ashely,Christine,Brandy".split(",");
    var lastNames = "Smith,Johnson,Williams,Jones,Brown,Davis,Miller,Wilson,Moore,Taylor,Anderson,Thomas,Jackson,White,Harris,Martin,Thompson,Garcia,Martinez,Robinson,Clark,Rodriguez,Lewis,Lee,Walker,Hall,Allen,Young,Hernandez,King,Wright,Lopez,Hill,Scott,Green,Adams,Baker,Gonzalez,Nelson,Carter,Mitchell".split(",");
    var codeNames = "venus,apollo,mercury,jupiter,homer,bart"
    var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
    var words = loremIpsum.split(" ");

    glu.fake = {
        /* DOCS DISABLED FOR NOW
         * Random number between 0 and n-1
         * @param n
         * @return {Number}
         */
        rand:function (n) {
            return Math.floor(n * Math.random());
        },
        /* DOCS DISABLED FOR NOW
         * Random number in range
         * If provided a singe argument, returns random number between 1 and n
         * @param min
         * @param max
         * @return {Number}
         */
        range:function (min, max) {
            if (max==null) {
                max = min;
                min = 1;
            }
            return min + this.rand(max-min + 1);
        },
        oneOf:function (set) {
            if (arguments.length>1){
                //arguments form the set
                set = [].slice.call(arguments);
            }
            set = glu.isString(set)?set.split(","):set;
            return set[this.rand(set.length)];
        },
        bigNumber:function (length) {
            var out = "";
            for (var i = 0; i < length; i++) {
                out += this.rand(10);
            }
            return out;
        },
        date:function (options) {
            options = options || {};
            var min = new Date(options.min);
            var max = new Date(options.max);
            var d = new Date(this.range(min.getTime(), max.getTime()));
            return d;
        },
        bool:function () {
            return this.rand(2) < 1;
        },
        name:function () {
            return oneOf(codeNames);
        },
        words:function (min, max) {
            return words.slice(0, this.range(min,max)).join(' ');
        },
        title:function (min, max) {
            return this.words(1,4);
        },
        contact : {
            name : function(sex){
                sex = sex == null ? glu.fake.oneOf('M','F') : sex.toUpperCase();
                return glu.fake.oneOf(sex=='M' ? boyFirstNames : girlFirstNames) + " " + glu.fake.oneOf(lastNames);
            },
            firstName:function (sex) {
                sex = sex == null ? glu.fake.oneOf('M','F') : sex.toUpperCase();
                return glu.fake.oneOf(sex=='M' ? boyFirstNames : girlFirstNames);
            },
            lastName:function () {
                return glu.fake.oneOf(lastNames);
            },
            phoneNumber : function(){
                return glu.fake.bigNumber(3) + " " + glu.fake.bigNumber(3) + "-" + glu.fake.bigNumber(4);
            },
            state : function(){
                return glu.fake.oneOf("TX,TN,AL,AK,MI,OH,CA");
            },
            zip : function(){
                return glu.fake.bigNumber(5);
            }
        }

    };

})();
