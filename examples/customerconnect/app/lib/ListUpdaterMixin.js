glu.mreg('sorted',{
    insert: function(idxToIgnore, obj, isTransfer){
        var existing = this.toArray();
        if (!this.sortRanker) throw "A list with the sorted mixin needs a sorter function.";
        var sortedIdx = _(existing).sortedIndex(obj, this.sortRanker);
        glu.List.prototype.insert.call(this, sortedIdx, obj, isTransfer);
    },
    resort:function(options){
        var sorted = _(this.toArray()).sortBy(this.sortRanker);
        if (!this.loadData) {
            throw 'Resorting requries the listupdater plugin'
        }
        this.loadData(sorted,options);
    }
});

glu.mreg('listupdater',{

    /**
     * Takes a list of rows and merges them in by key matching.
     * If they are identical to the current list, it is a no-op
     * Otherwise, adds/removes are generated (no transfers)
     * @param origArray
     * @param targetArray
     * @returns {Array}
     */
    loadData:function(target,options){
        var maxIterations = 1000;
        var options=options || {};
        var me = this;
        var changes =0;
        var rightKeys = target.map(function(o){return o[me.idProperty];});
        var rightMap = _.object(rightKeys,target);
        var leftMap = this.keyMap;
        //1: Process removals
        var leftKeys = this.toArray().map(function(o){return o[me.idProperty];});
        var me = this;
        leftKeys.forEach(function(k){
            if (!rightMap[k]) {
                me.removeAtKey(k);
                changes++;
            }
        });

        //2 Process adds by moving into correct spot
        rightKeys.forEach(function(k,idx){
            if (!leftMap[k]){
                me.insert(idx,rightMap[k]);
                changes++;
            }
        });

        //3 Process moves
        var idx=0;
        var iterations = 0;
        while (idx<rightKeys.length){
            if (iterations++ > maxIterations) throw "Stuck in a loop while loading data into a list.";
            var leftKeys = this.toArray().map(function(o){return o[me.idProperty];}); //TODO:Optimize
            var leftObj = this.getAt(idx);
            var rightOnLeftObj = this.getById(rightKeys[idx]);
            if (leftObj[me.idProperty]==rightKeys[idx]){

                //matches
                idx++;
                continue;
            }

            var leftOnRightIdx = rightKeys.indexOf(leftObj[me.idProperty]);
            var rightOnLeftIdx = leftKeys.indexOf(rightKeys[idx]);

            if (leftOnRightIdx>rightOnLeftIdx) {
                //MOVE OUT
                if (options.transfer) {
                    this.transferFrom(this,leftObj,leftOnRightIdx);
                    changes++;
                } else {
                    this.removeAt(idx);
                    changes++;
                    this.insert(leftOnRightIdx,leftObj);
                    changes++;
                }
            } else {
                //BRING IN
                if (options.transfer) {
                    this.transferFrom(this,rightOnLeftObj,idx);
                    changes++;
                } else {
                    this.removeAt(rightOnLeftIdx);
                    changes++;
                    this.insert(idx, rightOnLeftObj);
                    changes++;
                    idx++;
                }
            }
        }
        return changes;
    }

});