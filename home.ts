import { Component, OnInit } from '@angular/core';
import { HomeService } from '@services/home.service';
import * as Const from './constants';
import * as _ from 'lodash';

import { TreeView } from './tree';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    // debugger;

    const obj = _.merge({}, Const.Object1, Const.Object2);

    const schema = this.buildStructure(obj, Const.Object1, Const.Object2);

    debugger;

    // Grab expand/collapse buttons
    //
    // var expandAll = document.getElementById('expandAll');
    // var collapseAll = document.getElementById('collapseAll');
    //
    // Create tree
    //
    const source = new TreeView(schema.sourceNode, 'source')
    const destination = new TreeView(schema.destinationNode, 'destination')
  }

  buildStructure(obj: any, source: any, destination: any, sourceNode?: Array<Node>, destinationNode?: Array<Node>) {

    sourceNode = sourceNode || new Array<Node>();
    destinationNode = destinationNode || new Array<Node>();

    Object.entries(obj)
      .map(([key, property], data) => {
        // debugger;
        if (typeof property === 'object') {

          let destinationStatus: TreeStatus = null;
          let sourceStatus: TreeStatus = null;

          const sourceExists = _.has(source, key);
          const destinationExists = _.has(destination, key);

          const sourceValue = source[key];
          const destinationValue = destination[key];

          if (destinationExists && !sourceExists) {
            destinationStatus = TreeStatus.ADDED;
          } else if (sourceExists && destinationExists && sourceValue && destinationValue && sourceValue !== destinationValue) {
            destinationStatus = TreeStatus.CHANGED;
          } else if (sourceExists && !destinationExists) {
            sourceStatus = TreeStatus.DELETED
          }

          const children = this.buildStructure(property, sourceValue, destinationValue);

          const sourceChildren = children.sourceNode;
          const destinationChildren = children.destinationNode;

          sourceNode.push(new Node(key, sourceChildren, sourceStatus));
          destinationNode.push(new Node(key, destinationChildren, destinationStatus));

        } else if (Array.isArray(property)) {
          debugger;
        } else {
          debugger;
          let destinationStatus: TreeStatus = null;
          let sourceStatus: TreeStatus = null;

          const sourceExists = _.has(source, key);
          const destinationExists = _.has(destination, key);

          const sourceValue = source[key];
          const destinationValue = destination[key];

          if (destinationExists && !sourceExists) {
            destinationStatus = TreeStatus.ADDED;
          } else if (sourceExists && destinationExists && sourceValue && destinationValue && sourceValue !== destinationValue) {
            destinationStatus = TreeStatus.CHANGED;
          } else if (sourceExists && !destinationExists) {
            sourceStatus = TreeStatus.DELETED
          }

          if (destinationStatus !== TreeStatus.ADDED) {
            sourceNode.push(new Node({ [key]: sourceValue }, null, sourceStatus));
          }

          if (sourceStatus !== TreeStatus.DELETED) {
            destinationNode.push(new Node({ [key]: destinationValue }, null, destinationStatus));
          }
        }
      });

    return { sourceNode, destinationNode };
  }
}


export class Node {

  data: any;
  children: Array<any>;
  status: TreeStatus.ADDED | TreeStatus.CHANGED | TreeStatus.DELETED;

  constructor(
    data: any,
    children: Array<any> = [],
    status?: TreeStatus.ADDED | TreeStatus.CHANGED | TreeStatus.DELETED) {

    this.data = data;
    this.children = children;
    this.status = status;
  }
}

export enum TreeStatus {
  ADDED,
  CHANGED,
  DELETED
}


// buildStructure(obj: any, source: any, destination: any, sourceNode?: Array<Node>, destinationNode?: Array<Node>) {

//   nodes = nodes || new Array<Node>();

//   Object.entries(obj)
//     .map(([key, property], data) => {

//       if (typeof property === 'object') {
//         const children = this.buildStructure(property);
//         nodes.push(new Node(key, children));

//       } else {

//         nodes.push(new Node({ [key]: property }));
//       }
//     });

//   return nodes;
// }
// }
