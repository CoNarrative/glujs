describe('row view model spec', function () {
    if (!(Ext.getVersion().major > 3)) {
        return;
    }

    Given('a row view model and a reader', function () {
        var reader;
        Meaning(function(){
            glu.defRowModel('testNS.RowModel', {
                fields:['name', 'status', {name:'date', type:'date'}],
                formulas:{
                    statusOK:function () {
                        return this.status == 'active' || this.status == 'waiting';
                    }
                }
            });
            reader = Ext.create('glu.Reader', {
                model:'testNS.RowModel'
            });
        });
        When('Instantiating through a reader', function () {
            var rows;
            Meaning(function () {
                rows = reader.read([
                    {
                        name:'hey',
                        status:'active',
                        date:'5/3/4'
                    }
                ]).records;
            });
            ShouldHave ('Calculated a statusOK for the first record', function(){
                expect(rows[0].get('statusOK')).toBe (true);
            })
            When('we change the status property on which statusOK depends',function(){
                Meaning (function(){
                    rows[0].set('status','bogus');
                });
                ShouldHave ('updated the statusOK to false',function(){
                    expect(rows[0].get('statusOK')).toBe(false);
                })
            })
        })
    })
});