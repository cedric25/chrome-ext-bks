'use strict';

angular.module('BksManager', ['BksManager.filters'])

  /**
   * Main controller
   * @param $scope
   */
  .controller('BksController', ['$scope', function($scope) {

    $scope.showInputNewGroup = false;

    // New group object
    $scope.newGroup = {
      title: "",
      parentId: ""
    };

    $scope.selectedParents = {
      parent1: "",
      parent2: "",
      parent3: ""
    };

    /** Called at initialization */
    $scope.loadPage = function () {
      // Retrieves user's bookmarks from the cloud
      bookmarksService.getBookmarks($scope.getTreeCallback);
    };

    /**
     * Callback called each time the tree changes into Firebase
     * @param bksObject
     */
    $scope.getTreeCallback = function(bksObject) {
      $scope.tableGroups = bksObject.tableGroups;
      $scope.tableBookmarks = bksObject.tableBookmarks;
      $scope.$apply();
    };

    /**
     * Replaces Firebase content with actual browser bookmarks
     */
    $scope.reloadFromBrowser = function() {
      if (confirm('Are you sure you want to replace all remote bookmarks?')) {
        $scope.tableGroups = [];
        $scope.tableBookmarks = [];
        chrome.bookmarks.getTree(function callback(tree) {
          bookmarksService.saveChromeBookmarks(tree, firebaseSaveCallback);
        });
      }
    };

    /**
     * Callback function after Firebase persistency
     */
    var firebaseSaveCallback = function() {
      $scope.selectedParents.parent1 = "";
      $scope.loadPage();
    };

    /**
     * Click on a root folder
     */
    $scope.clickOnParent1 = function(parent) {
      $scope.selectedParents.parent2 = "";
      $scope.selectedParents.parent3 = "";
      if ($scope.selectedParents.parent1 === parent.id) {
        $scope.selectedParents.parent1 = "";
      } else {
        $scope.selectedParents.parent1 = parent.id;
      }
    };

    /**
     * Click on a sub-folder (Lvl 2)
     */
    $scope.clickOnParent2 = function(subGroup) {
      $scope.selectedParents.parent3 = "";
      if ($scope.selectedParents.parent2 === subGroup.id) {
        $scope.selectedParents.parent2 = "";
      } else {
        $scope.selectedParents.parent2 = subGroup.id;
      }
    };

    /**
     * Click on a sub-folder (Lvl 3)
     */
    $scope.clickOnParent3 = function(subGroup) {
      if ($scope.selectedParents.parent3 === subGroup.id) {
        $scope.selectedParents.parent3 = "";
      } else {
        $scope.selectedParents.parent3 = subGroup.id;
      }
    };

    /**
     * Filters displayed subgroups and bookmarks according to the selected root folder
     */
    $scope.showLvl2Groups = function() {

      var subGroups = _.filter($scope.tableGroups, function(group) {
        return group.parentId === $scope.selectedParents.parent1;
      });

      return $scope.selectedParents.parent1 != "" && subGroups.length;
    };

    /**
     * Filters displayed subgroups and bookmarks according to the selected lvl 2 folder
     */
    $scope.showLvl3Groups = function() {

      var subGroups = _.filter($scope.tableGroups, function(group) {
        return group.parentId === $scope.selectedParents.parent2;
      });

      return $scope.selectedParents.parent2 != "" && subGroups.length;
    };

    /**
     * Opens a new tab for the bookmark clicked on
     * @param url
     */
    $scope.clickOnBookmark = function(url) {
      window.open(url);
    };

    /**
     * Removes a bookmark from cloud bookmarks
     * @param bookmarkId
     */
    $scope.removeBookmark = function(bookmarkId) {
      firebaseService.removeBookmark(bookmarkId, function(error) {
        $scope.addMessage(error, "Bookmark removed successfully!");
      });
    };

    /**
     * Removes a group from cloud groups
     * @param groupId
     */
    $scope.removeGroup = function(groupId) {
      firebaseService.removeGroup(groupId, function(error) {
        $scope.addMessage(error, "Group removed successfully!");
      });
    };

    /**
     * Adds a new group of bookmarks
     * @param parentId
     */
    $scope.addGroup = function(parentId) {
      if (!_.isEmpty($scope.newGroup.title)) {
        $scope.newGroup.parentId = parentId.toString();
        bookmarksService.createGroup($scope.newGroup, function(error) {
          $scope.addMessage(error, "Group created successfully!");
        });
        $scope.showInputNewGroup = false;
        $scope.newGroup.title = "";
      }
    };

    $scope.addMessage = function(error, greenMessage) {
      if (error) {
        $scope.redMessage = "An error occured :-(";
      }
      else {
        $scope.greenMessage = greenMessage;
        $scope.$apply();
        setTimeout(function() {
          $scope.greenMessage = "";
          $scope.$apply();
        }, 2000);
      }
    };

  }]);