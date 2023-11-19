import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BitcoinService } from '../../services/bitcoin.service';
import { Bitcoin } from 'src/app/models/bitcoin';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bitcoin-graph',
  templateUrl: './bitcoin-graph.component.html',
  styleUrls: ['./bitcoin-graph.component.css'],
})
export class BitcoinGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart: ElementRef;

  bitcoinData: Bitcoin[];
  displayedBitcoinData: Bitcoin[] = [];
  selectedInterval: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'minute';
  chartInstance: any;

  constructor(private bitcoinService: BitcoinService) {}

  ngOnInit(): void {
    this.fetchBitcoinData();
  }

  ngAfterViewInit(): void {
    this.drawChart(this.displayedBitcoinData, 0, 0);
  }

  fetchBitcoinData(): void {
    this.bitcoinService.getAllBitcoinData().subscribe((response) => {
      if (Array.isArray(response.data)) {
        console.log('Bitcoin Data:', response.data);
        this.bitcoinData = response.data;
        this.updateDisplayedData();
      } else {
        console.error('Invalid data format:', response);
      }
    });
  }

  updateDisplayedData(): void {
    const currentTime = new Date().getTime();
  
    // Set filterDuration to 20 minutes if the selected interval is 'minute'
    const filterDuration = this.selectedInterval === 'minute' ? (20 * 60 * 1000) : this.getFilterDuration();
  
    this.displayedBitcoinData = this.bitcoinData.filter(item => {
      const timestamp = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
      const timeDifference = currentTime - timestamp.getTime();
  
      switch (this.selectedInterval) {
        case 'minute':
          return timeDifference < filterDuration;
        case 'hour':
          return timeDifference < (1 * 60 * 60 * 1000);
        case 'day':
          return timeDifference < (24 * 60 * 60 * 1000);
        case 'week':
          return timeDifference < (7 * 24 * 60 * 60 * 1000);
        case 'month':
          return timeDifference < (30 * 24 * 60 * 60 * 1000);
        case 'year':
          return timeDifference < (365 * 24 * 60 * 60 * 1000);
        default:
          return timeDifference < (1 * 60 * 1000);
      }
    });
  
    const minValue = Math.min(...this.displayedBitcoinData.map(item => item.value));
    const maxValue = Math.max(...this.displayedBitcoinData.map(item => item.value));
  
    this.drawChart(this.displayedBitcoinData, minValue, maxValue);
  }
  
  getFilterDuration(): number {
    const now = new Date();
  
    switch (this.selectedInterval) {
      case 'minute':
        return now.getTime() - (1 * 60 * 1000);
      case 'hour':
        return now.getTime() - (1 * 60 * 60 * 1000);
      case 'day':
        return now.getTime() - (24 * 60 * 60 * 1000);
      case 'week':
        return now.getTime() - (7 * 24 * 60 * 60 * 1000);
      case 'month':
        return now.getTime() - (30 * 24 * 60 * 60 * 1000);
      case 'year':
        return now.getTime() - (365 * 24 * 60 * 60 * 1000);
      default:
        return now.getTime() - (1 * 60 * 1000);
    }
  }
  


  updateChart(interval: string): void {
    switch (interval) {
      case 'minute':
      case 'hour':
      case 'day':
      case 'week':
      case 'month':
      case 'year':
        this.selectedInterval = interval;
        break;
      default:
        this.selectedInterval = 'minute';
    }
  
    // Eğer chartInstance mevcutsa, sadece verileri güncelle
    if (this.chartInstance) {
      this.updateDisplayedData();
    } else {
      // Yeni bir grafik çiz
      this.drawChart(this.displayedBitcoinData, 0, 0);
    }
  }

  drawChart(data: Bitcoin[], minValue: number, maxValue: number): void {
    const labels = data.map((item) => new Date(item.timestamp));
    const values = data.map((item) => item.value);
  
    const ctx = this.myChart.nativeElement.getContext('2d');
  
    // If there is no existing chart instance, create a new one
    if (!this.chartInstance) {
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Bitcoin Değeri',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: this.selectedInterval,
                stepSize: 1,
                tooltipFormat: 'DD-MM-YYYY HH:mm',
              },
              title: {
                display: true,
                text: 'Tarih',
              },
            },
            y: {
              beginAtZero: false, // Begin at zero or not based on your preference
              min: minValue,
              max: maxValue,
              title: {
                display: true,
                text: 'Değer',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Bitcoin Değer Grafiği',
            },
          },
        },
      });
    } else {
      // If there is an existing chart instance, update its data and options
      this.chartInstance.data.labels = labels;
      this.chartInstance.data.datasets[0].data = values;
      this.chartInstance.options.scales.x.time.unit = this.selectedInterval;
      this.chartInstance.options.scales.y.min = minValue;
      this.chartInstance.options.scales.y.max = maxValue;
      this.chartInstance.update(); // Update the chart
    }
  }
}
