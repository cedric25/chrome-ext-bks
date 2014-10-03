'use strict';

angular.module('BksManager', ['BksManager.filters'])

  /**
   * Main controller
   * @param $scope
   */
  .controller('BksController', ['$scope', function($scope) {

    /** Folders of bookmarks */
    $scope.tableGroups = [];

    /** List of bookmarks */
    $scope.tableBookmarks = [];

    /** List of distinct URLs  */
    var tableUrls = [];

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
      // Retrieves user's bookmarks from Firebase
      firebaseService.getTree($scope.getFirebaseTreeCallback);
    };

    /**
     * Callback called each time the tree changes into Firebase
     * @param firebaseTree
     */
    $scope.getFirebaseTreeCallback = function(firebaseTree) {

      $scope.tableGroups = [];
      $scope.tableBookmarks = [];
      tableUrls = [];

      var firebaseTreeObj = firebaseTree.val();

      // Explodes bookmarks into tables of groups and bookmarks
      if (typeof firebaseTreeObj === 'object') {
        _.each(firebaseTreeObj[0].children, $scope.populateBksTable);
      }

      $scope.$apply();
    };

    /**
     * Populates the bookmarks' table
     * @param node
     */
    $scope.populateBksTable = function (node) {
      if (node.url != undefined) {
        if ($.inArray(node.url, tableUrls) == -1) {
          var bkObj = new Bookmark(node.id, node.title, node.url, node.parentId);
          $scope.tableBookmarks.push(bkObj);
          tableUrls.push(bkObj.url);
        }
      }
      // Not a bookmark, but a group of them (or an empty group)
      else if (!_.isUndefined(node.children) && node.children.length > 0) {
        $scope.tableGroups.push(node);
        _.each(node.children, $scope.populateBksTable);
      }
    };

    /**
     * Replaces Firebase content with actual browser bookmarks
     */
    $scope.reloadFromBrowser = function() {
      if (confirm('Are you sure you want to replace all remote bookmarks?')) {
        chrome.bookmarks.getTree(function callback(tree) {
          firebaseService.saveFlatBookmarks(tree, firebaseSaveCallback);
        });
      }
    };

    /**
     * Callback function after Firebase persistency
     */
    var firebaseSaveCallback = function() {
      console.log("Firebase save finished");
      $scope.selectedParents.parent1 = "";
      $scope.$apply();
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

    $scope.clickOnBookmark = function(url) {
      window.open(url);
    };

  }]);