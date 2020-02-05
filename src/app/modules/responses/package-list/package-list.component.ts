import { Component, OnInit } from '@angular/core';

interface Package {
  id: number;
  title: string;
  classification: string;
}

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  defaultElevation = 2;
  raisedElevation = 8;

  packages: Package[] = [
    {
      id: 11,
      title: 'First Package  Jan 2020',
      classification: 'Unclassified'
    },
    {
      id: 12,
      title: 'BaaSU Package  Jan 2020 ',
      classification: 'Unclassified'
    },
    { id: 13, title: 'NEBS Package  Jan 2020', classification: 'Unclassified' },
    {
      id: 14,
      title: 'ABIS Package  Jan 2020',
      classification: 'Unclassified Law Enforcement Sensitive'
    },
    {
      id: 15,
      title: 'High-Tide Package  Jan 2020',
      classification: 'Unclassified For Official Use Only'
    },
    {
      id: 16,
      title: 'Low-Ball Package  Feb 2020',
      classification: 'Unclassified'
    },
    { id: 17, title: 'DOD Package  Feb 2020', classification: 'Unclassified' },
    { id: 18, title: 'DHS Package  Feb 2020', classification: 'Unclassified' },
    {
      id: 19,
      title: 'Urgent Package  Feb 2020',
      classification: 'Unclassified For Official Use Only'
    },
    {
      id: 20,
      title: 'Quick Package  Feb 2020',
      classification: 'Unclassified'
    },
    {
      id: 21,
      title: 'DNI Package  Feb 2020',
      classification: 'Unclassified For Official Use Only'
    },
    { id: 22, title: 'TSA Package  Feb 2020', classification: 'Unclassified' },
    {
      id: 23,
      title: 'FAA Package  Feb 2020',
      classification: 'Unclassified For Official Use Only'
    },
    {
      id: 24,
      title: 'Last Package  Feb 2020',
      classification: 'Unclassified Law Enforcement Sensitive'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
