Given ('A view model with a list of view models (each of which contains a list)',function(){
    var main, mainView;
    Meaning(function(){
        glu.defModel('listspec.main',{
            cones : {
                mtype:'list'
            }
        });
        glu.defModel('listspec.icecreamcone', {
            name:'',
            scoops:{mtype:'list'}
        });
        glu.defView('listspec.main',{
            items:'@{cones}'
        });
        glu.defView('listspec.icecreamcone',{
            title:'@{name}',
            items:'@{scoops}'
        });
        main = glu.model('listspec.main');
        mainView = glu.view(main);
    });
    When ('we add a cone to the list',function(){
        var superduper;
        Meaning (function(){
            main.cones.add({
                mtype:'icecreamcone',
                name:'superduper'
            });
            superduper = main.cones.getAt(0);
        });
        Should('have added the corresponding widget',function(){
            expect( mainView.items.getAt(0).title).toEqual('superduper');
        });
        Should('have one listener on the added event for the cones list',function(){
            expect( Object.keys(main.cones._ob.events.added.listeners).length).toBe (1);
        });
        Should('have one listener on the added event for the scoops list',function(){
            expect( Object.keys(main.cones.getAt(0).scoops._ob.events.added.listeners).length).toBe (1);
        });
        When ('we remove a cone from the list',function(){
            Meaning (function(){
                main.cones.removeAt(0);
            });
            Should('have removed the corresponding widget',function(){
                expect( mainView.items.length).toBe(0);
            });
            Should('still have one listener on the added event for the cones list',function(){
                expect( Object.keys(main.cones._ob.events.added.listeners).length).toBe (1);
            });
            Should('have pulled the listeners on the added event for the scoops list because the super-duper ice cream cone is no longer bound to a component',function(){
                expect( Object.keys(superduper.scoops._ob.events.added.listeners).length).toBe (0);
            });
        });
    });
});