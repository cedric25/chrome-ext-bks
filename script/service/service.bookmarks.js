'use strict';

var bookmarksService = {

  /** Folders of bookmarks */
  tableGroups: [],

  /** List of bookmarks */
  tableBookmarks: [],

  /** List of distinct URLs  */
  tableUrls: [],

  /** Controller callback */
  controllerCallback: null,

  /**
   * Public method to be called from controllers
   * Asks Firebase the user's bookmarks and groups
   * @param controllerCallback Callback
   */
  getBookmarks: function(controllerCallback) {
    bookmarksService.controllerCallback = controllerCallback;
    firebaseService.getAll(bookmarksService.getFirebaseCallback);
  },

  /**
   * Creates a JS object from Firebase JSON
   * @param firebaseData Data containing tables of bookmarks and groups given by Firebase
   */
  getFirebaseCallback: function(firebaseData) {

    var firebaseObj = firebaseData.val();

    bookmarksService.controllerCallback({
      tableGroups: firebaseObj.groups,
      tableBookmarks: firebaseObj.bookmarks
    });
  },

  /**
   * Populates the bookmarks' table
   * @param node
   */
  populateBksTable: function (node) {
    if (node.url != undefined) {
      if ($.inArray(node.url, bookmarksService.tableUrls) == -1) {
        var bkObj = new Bookmark(node.id, node.title, node.url, node.parentId);
        bookmarksService.tableBookmarks[bkObj.id] = bkObj;
        bookmarksService.tableUrls.push(bkObj.url);
      }
    }
    // Not a bookmark, but a group of them (or an empty group)
    else if (!_.isUndefined(node.children) && node.children.length > 0) {
      var groupObj = new Group(node.id, node.title, node.parentId);
      bookmarksService.tableGroups.push(groupObj);
      _.each(node.children, bookmarksService.populateBksTable);
    }
  },

  saveChromeBookmarks: function(chromeTree, callback) {

    bookmarksService.resetTables();

    // Fills URLs and groups tables from tree
    _.each(chromeTree[0].children, bookmarksService.populateBksTable);

    firebaseService.saveBookmarks(bookmarksService.tableBookmarks);
    firebaseService.saveGroups(bookmarksService.tableGroups);

    callback();
  },

  resetTables: function() {
    bookmarksService.tableBookmarks = [];
    bookmarksService.tableGroups = [];
    bookmarksService.tableUrls = [];
  },

  /**
   * Creates a new bookmark into Firebase
   * @param bookmark Object to be saved
   * @param callback Callback
   */
  createBookmark: function(bookmark, callback) {
    firebaseService.createBookmark(bookmark, callback);
  }

};