import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.css']
})
export class DadosComponent {

  constructor(private clienteService: ClienteService){}

  chart: any;
  pieChart: any;


  ngOnInit() {
    this.clienteService.getClientesPorMes().subscribe(data => {
      //console.log('Dados recebidos:', data);
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const clientesPorMes = data.map(item => item.clientes);
      //console.log('Clientes por mês:', clientesPorMes);

      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Clientes',
              data: clientesPorMes,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 3000, // Define a duração da animação em milissegundos
            easing: 'easeOutQuart' // Define a função de interpolação para a animação (opcional)
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 100,
              ticks: {
                font: {
                  weight: 'bold',
                  size: 22 
                }
              }
            },
            x: {
              ticks: {
                color: 'black',
                
                font: {
                  weight: 'bold',
                  size: 14,
                  
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  weight: 'bold',
                  size: 18
                },
                
              }
            }
          }
        }
      });
     
      
      
      
      
      
      


    });

    
  }
}

