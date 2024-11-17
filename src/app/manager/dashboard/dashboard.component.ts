import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DatabaseService } from 'src/app/services/database.service';
import { Room } from 'src/app/structures/rooms.structure';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  rooms: Room[];
  totalIncome: any;
  booking: any;
  totalGuest: any;
  guests: any;
  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    await this.databaseService.getCounters().then((docs) => {
      const data = docs.data();
      console.log(data);
      if (data) {
        this.totalGuest = docs.data()!.totalGuests;
        this.totalIncome = docs.data()!.totalIncome;
        this.booking = docs.data()!.totalBookings;
      }
    });
    await this.databaseService.getFirstRooms(10).then((docs) => {
      this.rooms = [];
      docs.forEach(async (doc) => {
        this.rooms.push({ roomId: doc.id, ...doc.data() } as Room);
      });
    });
    this.guests = [];
    await this.databaseService.getFirstGuests(10).then((docs) => {
      docs.forEach(async (doc) => {
        console.log(doc.data());
        this.guests.push({
          name: doc.data()!.name,
        });
      });
    });

    const labels = ['jan', 'feb', 'mar', 'april'];
    const myChart = new Chart('myChart', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [
              // this.availableRooms,
              // this.rooms.length - this.availableRooms,
            ],
            backgroundColor: ['rgb(233, 108, 76)', 'rgb(0, 0, 0)'],
            hoverOffset: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    const myChart1 = new Chart('myChart1', {
      labels: {
        render: 'percentage',
      },
      type: 'bar',
      data: {
        datasets: [
          {
            data: [65, 59, 80, 81],
            backgroundColor: [
              'rgba(233, 108, 76, 0.9)',
              'rgba(0, 0, 0, 0.9)',
              'rgba(255, 205, 86, 0.9)',
              'rgba(75, 192, 192, 0.9)',
              'rgba(54, 162, 235, 0.9)',
              'rgba(153, 102, 255, 0.9)',
              'rgba(201, 203, 207, 0.9)',
            ],
          },
        ],
      },
    });
    const myChart2 = new Chart('myChart2', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(233, 108, 76)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
