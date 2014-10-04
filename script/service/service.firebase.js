'use strict';

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
   * Retrieves bookmarks and groups
   * Callback called each time something changes in Firebase (ex: a new bookmark is being added)
   * @returns Object containing tables of bookmarks and groups
   */
  getAll: function(callback) {
    return myDataRef.root().on('value', callback);
  },

  /**
   * Creates a new bookmark into Firebase
   * @param bookmark
   * @param callback
   */
  createBookmark: function(bookmark, callback) {
    var newBookmarkRef = myDataRef.child('bookmarks').push(bookmark, function(error) {
      // Sets id
      newBookmarkRef.child('id').set(newBookmarkRef.name());
      callback();
    });
  },

  saveBookmarks: function(tableBookmarks) {
    myDataRef.child('bookmarks').set(tableBookmarks);
  },

  saveGroups: function(tableGroups) {
    myDataRef.child('groups').set(tableGroups);
  },

  removeBookmark: function(bookmarkId, callback) {
    myDataRef.child('bookmarks/' + bookmarkId).remove(callback);
  }

};