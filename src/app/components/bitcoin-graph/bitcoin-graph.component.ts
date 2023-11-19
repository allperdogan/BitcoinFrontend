// bitcoin-graph.component.ts

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BitcoinService } from '../../services/bitcoin.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bitcoin-graph',
  templateUrl: './bitcoin-graph.component.html',
  styleUrls: ['./bitcoin-graph.component.css'],
})
export class BitcoinGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart: ElementRef;

  bitcoinData: any[];

  constructor(private bitcoinService: BitcoinService) {}

  ngOnInit(): void {
    // Verileri çekme işlemini buradan çıkarıp, ngAfterViewInit içine alıyoruz.
  }

  ngAfterViewInit(): void {
    this.bitcoinService.getAllBitcoinData().subscribe((response) => {
      if (Array.isArray(response.data)) {
        console.log(response.data);
        this.bitcoinData = response.data;
        this.drawChart(response.data);
      } else {
        console.error('Invalid data format:', response);
      }
    });
  }

  drawChart(data: any[]): void {
    const labels = data.map(item => new Date(item.timestamp)); // Timestamp'leri Date nesnelerine dönüştür
    const values = data.map(item => item.value);
  
    const ctx = this.myChart.nativeElement.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bitcoin Değeri',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD-MM-YYYY',
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

