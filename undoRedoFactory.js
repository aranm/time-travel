/*globals window, define*/
(function () {
   var factory = function () {
      var createCompundMemento = function () {
         var undoList = [],
            pushDo = function(memento) {
               undoList.push(memento);
            },
            restore = function() {
               var compoundMemento = createCompundMemento();
               for (var undoIndex = 0; undoIndex < undoList.length; undoIndex++) {
                  compoundMemento.pushDo(this.undoList[undoIndex].restore());
               }
               return compoundMemento;
            };

         return {
            pushDo: pushDo,
            restore: restore
         };
      },
      create = function () {
         var undoStack = [],
            redoStack = [],
            inUndoRedo = false,
            compoundMemento = null,
            executeDo = function(memento) {
               redoStack.length = 0;
               undoStack.push(memento);
            },
            pushDo = function(memento) {
               if (inUndoRedo) {
                  return;
               }
               if (compoundMemento == null) {
                  executeDo(memento);
               }
               else {
                  compoundMemento.pushDo(memento);
               }
            },
            beginCompoundDo = function() {
               if (compoundMemento != null) {
                  endCompoundDo();
               }
               compoundMemento = createCompundMemento();
            },
            endCompoundDo = function() {
               if (compoundMemento != null) {
                  var temp = compoundMemento;
                  compoundMemento = null;
                  pushDo(temp);
               }
            },
            canUndo = function() {
               return (undoStack.length > 0);
            },
            canRedo = function() {
               return (redoStack.length > 0);
            },
            clear = function() {
               undoStack.length = 0;
               redoStack.length = 0;
            },
            undo = function() {
               if (compoundMemento != null) {
                  endCompoundDo();
               }
               inUndoRedo = true;
               var top = undoStack.pop();
               redoStack.push(top.restore());
               inUndoRedo = false;
            },
            redo = function() {
               if (compoundMemento != null) {
                  endCompoundDo();
               }
               inUndoRedo = true;
               var top = redoStack.pop();
               undoStack.push(top.restore());
               inUndoRedo = false;
            },
            peekUndo = function() {
               if (canUndo() == false) {
                  return null;
               }
               else {
                  return undoStack[undoStack.length - 1];
               }
            },
            peekRedo = function() {
               if (canRedo() == false) {
                  return null;
               }
               else {
                  return redoStack[redoStack.length - 1];
               }
            };

         return {
            pushDo: pushDo,
            beginCompoundDo: beginCompoundDo,
            endCompoundDo: endCompoundDo,
            canUndo: canUndo,
            canRedo: canRedo,
            clear: clear,
            undo: undo,
            redo: redo,
            peekUndo: peekUndo,
            peekRedo: peekRedo
         };
      };

      return {
         create: create
      };
   };

   if (typeof define === "function" && define.amd) {
      define("undoRedoFactory", [], function () {
         return factory();
      });
   }
   else {
      window.undoRedoFactory = factory();
   }
})();
