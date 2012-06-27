describe('Named grid bindings spec', function () {
    Given('a named grid', function () {
        var view, vm, charCfg, classroomCfg;
        Meaning(function () {
            testNs = {
                models:{
                    student:{fields:[
                        {name:'id'},
                        {name:'firstName'}
                    ]},
                    classroom:{fields:[
                        {name:'id'},
                        {name:'building'},
                        {name:'roomnumber'}
                    ]}
                },
                viewmodels:{
                    tester:{
                        studentList:{
                            mtype:'glustore',
                            model:'student'
                        },
                        classroomList:{
                            mtype:'glustore',
                            model:'classroom'
                        },
                        openStudent:function () {
                        },
                        studentSelections:[],
                        classroomSelection:{},
                        studentWithFocus:{},
                        classroomWithFocus:{},
                        studentListIsExpanded:false,
                        studentListIsEnabled:false,
                        studentListIsVisible:false
                    }
                },
                views:{
                    tester:{
                        items:[
                            {
                                xtype:'grid',
                                name:'studentList'
                            },
                            {
                                xtype:'grid',
                                name:'classroomList'
                            }
                        ]
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm);
            charCfg = view.items.get(0)._bindingMap;
            classroomCfg = view.items.get(1)._bindingMap;
        });
        ShouldHave('bound the store to studentList', function () {
            expect(charCfg.store).toEqual('@{studentList}');
        });
        ShouldHave('bound the double-click handler to openStudent', function () {
            expect(charCfg.listeners.itemdblclick).toEqual('@?{..openStudent}');
        });
        ShouldHave('bound the selected property to studentSelections', function () {
            expect(charCfg.selected).toEqual('@?{studentSelections}');
        });
        ShouldHave('bound the selected property of the classroom to classroomSelection', function () {
            expect(classroomCfg.selected).toEqual('@?{classroomSelection}');
        });
        ShouldHave('bound the student with focus property', function () {
            expect(charCfg.focus).toEqual('@?{studentWithFocus}');
        });
        ShouldHave('bound the classroom with focus property', function () {
            expect(classroomCfg.focus).toEqual('@?{classroomWithFocus}');
        });
        ShouldHave('bound the collapsibility of student list', function () {
            expect(charCfg.collapsed).toEqual('@?{!studentListIsExpanded}');
        });
        ShouldHave('bound disabled of student list', function () {
            expect(charCfg.disabled).toEqual('@?{!studentListIsEnabled}');
        });
        ShouldHave('bound hidden of student list', function () {
            expect(charCfg.hidden).toEqual('@?{!studentListIsVisible}');
        });
    })
});
