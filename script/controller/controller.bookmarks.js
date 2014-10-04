'use strict';

angular.module('BksManager', ['BksManager.filters'])

  /**
   * Main controller
   * @param $scope
   */
  .controller('BksController', ['$scope', function($scope) {

    $scope.selectedParents = {
      parent1: "",
      parent2: "",
      parent3: ""
    };

    /** Only the root folders */
    $scope.rootFoldersFilter = {
      parentId: "0"
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

    $scope.removeBookmark = function(bookmarkId) {
      console.log(bookmarkId);
      firebaseService.removeBookmark(bookmarkId, function(error) {
        if (error) {
          $scope.redMessage = "An error occured :-(";
        }
        else {
          $scope.greenMessage = "Bookmark removed successfully!";
          $scope.$apply();
          setTimeout(function() {
            $scope.greenMessage = "";
            $scope.$apply();
          }, 2000);
        }
      });
    };

  }]);