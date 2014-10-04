'use strict';

// On document ready (vanilla JS)
/*document.addEventListener('DOMContentLoaded', function () {

  // Register click event on button "My Bookmarks"
  document.getElementById('bt_myBookmarks').onclick = function() {
    chrome.tabs.create({
      'index': 0,
      'url': chrome.extension.getURL('view/bookmarks.html')
    }, function(tab) {

    });
  };

});*/

angular.module('BksManager', [])

/**
 * Popup controller
 * @param $scope
 */
  .controller('BksController', ['$scope', function($scope) {

    // New bookmark object
    $scope.newBookmark = {
      url: "",
      title: "",
      parentId: ""
    };

    /** Called at initialization */
    $scope.loadPage = function () {

      // Loads all bookmarks from cloud
      $scope.bookmarks = bookmarksService.getBookmarks($scope.getTreeCallback);

      // Gets URL of current webpage
      chrome.tabs.getSelected(null, function(currentTab) {
        $scope.newBookmark.title = currentTab.title;
        $scope.newBookmark.url = currentTab.url;
        $scope.$apply();
      });
    };

    /**
     * Callback called each time the tree changes into Firebase
     * @param bksObject
     */
    $scope.getTreeCallback = function(bksObject) {
      var tableGroups = bksObject.tableGroups;
      $scope.tableGroups = _.sortBy(tableGroups, function(group) {
        return group.title;
      });
      $scope.$apply();
    };

    /**
     * Opens a new tab with all cloud bookmarks
     */
    $scope.openHome = function() {
      chrome.tabs.create({
        'index': 0,
        'url': chrome.extension.getURL('view/bookmarks.html')
      }, function(tab) {

      });
    };

    $scope.createBookmark = function() {

      // Adds new bookmark to Chrome
      //chrome.bookmarks.create($scope.newBookmark);

      // Adds new bookmark into the cloud
      bookmarksService.createBookmark($scope.newBookmark, function() {
        $scope.message = "Bookmark saved with success!";
        $scope.$apply();
        setTimeout(function() {
          $scope.message = "";
          $scope.$apply();
        }, 2000);
      });
    };

  }]);