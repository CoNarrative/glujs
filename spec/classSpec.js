describe('(psuedo) class specs', function () {
    var MyClassA, myClassB;
    Given('a class and an instance of it', function () {
        var helloSpy, instanceA;
        Meaning(function () {
            helloSpy = jasmine.createSpy();
            MyClassA = glu.extend(Object, {
                hello: helloSpy
            });
            instanceA = new MyClassA();
        });
        When('a function on the supplied prototype is called', function(){
            Meaning(function(){
                instanceA.hello();
            });
            ShouldHave('called the function',function(){
                expect (helloSpy).toHaveBeenCalled();
            });
        });
        When('the class is subclassed and an instance created', function(){
            var goodbyeSpy, instanceB;
            Meaning(function () {
                goodbyeSpy = jasmine.createSpy();
                MyClassB = glu.extend(MyClassA, {
                    goodbye: goodbyeSpy
                });
                instanceB = new MyClassB();
            });
            When('a function on the base prototype is called', function(){
                Meaning(function(){
                    instanceB.hello();
                });
                ShouldHave('called the function',function(){
                    expect (helloSpy).toHaveBeenCalled();
                });
            });
            When('a function on the supplied prototype is called', function(){
                Meaning(function(){
                    instanceB.goodbye();
                });
                ShouldHave('called the function',function(){
                    expect (goodbyeSpy).toHaveBeenCalled();
                });
            });
        })
    });
    Given('a class with a constructor and an instance of it', function () {
        var helloSpy, instanceA;
        Meaning(function () {
            helloSpy = jasmine.createSpy();
            MyClassA = glu.extend(Object, {
                constructor : function(){
                    this.initA = true;
                },
                hello: helloSpy
            });
            instanceA = new MyClassA();
        });
        ShouldHave ('called the constructor',function(){
            expect(instanceA.initA).toBeTruthy();
        });
        When('a function on the supplied prototype is called', function(){
            Meaning(function(){
                instanceA.hello();
            });
            ShouldHave('called the function',function(){
                expect (helloSpy).toHaveBeenCalled();
            });
        });
        When('the class is subclassed wihtout a custom constructor and an instance created', function(){
            var goodbyeSpy, instanceB;
            Meaning(function () {
                goodbyeSpy = jasmine.createSpy();
                MyClassB = glu.extend(MyClassA, {
                    goodbye: goodbyeSpy
                });
                instanceB = new MyClassB();
            });
            ShouldHave ('called the base constructor',function(){
                expect(instanceB.initA).toBeTruthy();
            });
            When('a function on the base prototype is called', function(){
                Meaning(function(){
                    instanceB.hello();
                });
                ShouldHave('called the function',function(){
                    expect (helloSpy).toHaveBeenCalled();
                });
            });
            When('a function on the supplied prototype is called', function(){
                Meaning(function(){
                    instanceB.goodbye();
                });
                ShouldHave('called the function',function(){
                    expect (goodbyeSpy).toHaveBeenCalled();
                });
            });
        });
        When('the class is subclassed WITH a custom constructor and an instance created', function(){
            var goodbyeSpy, instanceB;
            Meaning(function () {
                goodbyeSpy = jasmine.createSpy();
                MyClassB = glu.extend(MyClassA, {
                    constructor : function(){
                        this.initB=true;
                        MyClassB.superclass.constructor.apply(this);
                    },
                    goodbye: goodbyeSpy
                });
                instanceB = new MyClassB();
            });
            ShouldHave ('called the base constructor',function(){
                expect(instanceB.initA).toBeTruthy();
            });
            ShouldHave ('called the supplied constructor',function(){
                expect(instanceB.initB).toBeTruthy();
            });
            When('a function on the base prototype is called', function(){
                Meaning(function(){
                    instanceB.hello();
                });
                ShouldHave('called the function',function(){
                    expect (helloSpy).toHaveBeenCalled();
                });
            });
            When('a function on the supplied prototype is called', function(){
                Meaning(function(){
                    instanceB.goodbye();
                });
                ShouldHave('called the function',function(){
                    expect (goodbyeSpy).toHaveBeenCalled();
                });
            });
        })
        When('the class is subclassed WITH a custom constructor BUT that constructor doesn not call parent and an instance created', function(){
            var goodbyeSpy, instanceB;
            Meaning(function () {
                goodbyeSpy = jasmine.createSpy();
                MyClassB = glu.extend(MyClassA, {
                    constructor : function(){
                        this.initB=true;
                    },
                    goodbye: goodbyeSpy
                });
                instanceB = new MyClassB();
            });
            ShouldHave ('NOTcalled the base constructor',function(){
                expect(instanceB.initA).toBeUndefined();
            });
            ShouldHave ('called the supplied constructor',function(){
                expect(instanceB.initB).toBeTruthy();
            });
            When('a function on the base prototype is called', function(){
                Meaning(function(){
                    instanceB.hello();
                });
                ShouldHave('called the function',function(){
                    expect (helloSpy).toHaveBeenCalled();
                });
            });
            When('a function on the supplied prototype is called', function(){
                Meaning(function(){
                    instanceB.goodbye();
                });
                ShouldHave('called the function',function(){
                    expect (goodbyeSpy).toHaveBeenCalled();
                });
            });
        })
    });
});