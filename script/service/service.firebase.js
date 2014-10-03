// https://bks-manager.firebaseio.com/
var firebaseUrl = "https://bks-manager.firebaseio.com";
var myDataRef = new Firebase(firebaseUrl);

var firebaseService = {

  /**
   * Saves all bookmarks the same way as Chrome does
   * @param flatBookmarks
   * @param callback
   */
  saveFlatBookmarks: function(flatBookmarks, callback) {
    myDataRef.child('bookmarks').set(flatBookmarks, callback);
  },

  /**
   * Retrieves complete bookmarks tree
   * @returns Bookmarks tree
   */
  getTree: function(callback) {
    return myDataRef.child('bookmarks').on('value', callback);
  }

};