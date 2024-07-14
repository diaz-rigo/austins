import { Component, OnInit } from '@angular/core'
import { DatalocalService } from '../../commons/services/datalocal.service'
interface GroupedSales {
  [key: string]: number
}

interface Venta {
  categoria: string
  cantidad: number
  fecha: Date // Asegúrate de que la fecha sea del tipo Date
}

interface SelectedCategory {
  categoria: string
  icono: string // Nueva propiedad para almacenar el nombre del icono
  cantidad: number // Agregar la propiedad 'cantidad'
  fecha: string
  // Agrega aquí cualquier otra propiedad que tenga selectedCategory
}

@Component({
  selector: 'app-data-grafica',
  templateUrl: './data-grafica.view.html',
  styleUrls: ['./data-grafica.view.scss'],
})
export class DataGraficaView implements OnInit {
  ventas: {
    categoria: string
    cantidad: number
    fecha: string
  }[] = []
  // ventas: {
  //   categoria: string;
  //   cantidad: number;
  //   fecha: string;
  // }[] = [];
  p: number = 0
  c: number = 0
  k: number = 0
  projectedSales: string = ''
  proyeccionVentasInfo: string = ''

  ventaInicial: string = ''
  selectedYear: string = ''
  diasHastaFechaFutura: number = 0
  chartData: any
  chartOptions: any
  // selectedCategory: SelectedCategory | null = null;
  selectedCategory: SelectedCategory | null = null
  can = 0
  // selectedCategory: string = '';
  selectedStartDate: string = ''
  selectedFutureDate: string = '' // Agrega la variable para almacenar la fecha futura seleccionada
  date: string = '' // Agrega la variable para almacenar la fecha futura seleccionada
  predictedSales: number | null = null

  chartDataFuturas: any
  chartOptionsFuturas: any
  constructor(private jsonDataService: DatalocalService) {}

  ngOnInit() {
    this.jsonDataService.getData().subscribe((data) => {
      this.ventas = data
      this.updateChartData()
      // this.updateChartData();
      this.updateChartFuturas()
    })
  }
  selectCategory(category: SelectedCategory): void {
    this.selectedCategory = category
    // let cantidad: number = this.selectedCategory.cantidad;
    this.can = this.selectedCategory.cantidad
    // console.log('selectedCategory:', this.selectedCategory.cantidad)
    this.updatePredictions()
    this.updatePredictions()
  }

  selectStartDate(date: string): void {
    this.selectedStartDate = date
    this.updatePredictions()
  }

  selectFutureDate(date: string): void {
    this.selectedFutureDate = date
    this.updatePredictions()
  }
  selectotraDate(date: string): void {
    // Verificar si this.predictedSales es null y asignarle un valor predeterminado si es necesario
    const initialSales = this.predictedSales ?? 0

    // Convertir la cadena de fecha a un objeto de fecha
    // const selectedDate = new Date(date);
    const selectedDate1 = new Date(this.selectedFutureDate)
    const selectedDate2year = new Date(date)

    //     // Obtener el año, mes y día seleccionados del objeto de fecha
    const selectedYear = selectedDate2year.getFullYear()
    const selectedMonth = selectedDate1.getMonth()
    const selectedDay = selectedDate1.getDate()

    //     // Obtener el año inicial a partir de la fecha futura seleccionada
    const initialDate = new Date(this.selectedFutureDate)
    const initialYear = initialDate.getFullYear()

    //     // Calcular la diferencia en años entre el año seleccionado y el año inicial
    const differenceInYears = selectedYear - initialYear

    //     // Obtener la tasa de crecimiento
    const growthRate = this.k

    //     // Calcular la proyección de ventas utilizando la fórmula de crecimiento exponencial
    //     // const projectedSales = initialSales * Math.pow((1 + growthRate), differenceInYears);
    //     // Calcular la proyección de ventas utilizando la fórmula de crecimiento exponencial
    const projectedSales =
      initialSales * Math.pow(1 + growthRate, differenceInYears)

    // // Redondear la proyección de ventas a dos decimales
    // const roundedProjectedSales = Math.round(projectedSales * 100) / 100; // Redondea a dos decimales
    const roundedProjectedSales = projectedSales.toFixed(1)
    this.selectedYear=`${selectedYear}`
    this.proyeccionVentasInfo = ` Proyección de ventas para el ${selectedDay} de ${
      selectedMonth + 1
    } de ${selectedYear}:
 es de ${roundedProjectedSales} , con  la tasa de crecimiento de =${growthRate} `

    this.projectedSales = roundedProjectedSales;
    this.updatePredictions()
  }

  calcularTasaCrecimiento(
    ventas: any[],
    selectedStartDate: Date,
    selectedFutureDate: Date,
  ): number {
    // Creamos dos arreglos para almacenar los días transcurridos y las ventas correspondientes
    const diasTranscurridos: number[] = []
    const ventasCantidad: number[] = [] // Cambié el nombre del arreglo para evitar confusiones

    // Llenamos los arreglos con los datos de ventas proporcionados
    ventas.forEach((venta) => {
      // Convertimos las fechas de inicio y futuras a objetos de fecha
      const fechaInicio = new Date(venta.fecha)
      const fechaFutura = selectedFutureDate

      // Calculamos los días transcurridos entre la fecha de inicio y la futura
      const tiempoTranscurrido = Math.abs(
        fechaFutura.getTime() - fechaInicio.getTime(),
      )
      const diasTranscurridosVenta = tiempoTranscurrido / (1000 * 60 * 60 * 24) // Convertimos a días

      // Añadimos los días transcurridos y las ventas correspondientes a los arreglos
      diasTranscurridos.push(diasTranscurridosVenta)
      ventasCantidad.push(venta.cantidad)
    })

    // Calculamos la suma de los productos de los días transcurridos y las ventas
    let sumaDiasVentas = 0
    for (let i = 0; i < diasTranscurridos.length; i++) {
      sumaDiasVentas += diasTranscurridos[i] * ventasCantidad[i]
    }

    // Calculamos la suma de los cuadrados de los días transcurridos
    let sumaDiasCuadrados = 0
    for (let i = 0; i < diasTranscurridos.length; i++) {
      sumaDiasCuadrados += diasTranscurridos[i] ** 2
    }

    // Calculamos la tasa de crecimiento (k) utilizando la fórmula de mínimos cuadrados
    const k = sumaDiasVentas / sumaDiasCuadrados

    return k
  }

  // Función para predecir las ventas futuras utilizando la ecuación diferencial de crecimiento exponencial
  // Función para predecir las ventas futuras utilizando un modelo de crecimiento lineal
  predecirVentasFuturas(ventaInicial: any, k: number, t: number): number {
    const c = ventaInicial.cantidad // Ventas iniciales
    this.k = k
    // this.t=t
    this.c = c
    return c + k * t // Utilizamos un modelo de crecimiento lineal en lugar de exponencial
  }

  // Función para actualizar las predicciones de ventas
  updatePredictions(): void {
    // console.log('selectedCategory:', this.selectedCategory)
    // console.log('selectedStartDate:', this.selectedStartDate)
    // console.log('selectedFutureDate:', this.selectedFutureDate)

    if (
      this.selectedCategory &&
      this.selectedStartDate &&
      this.selectedFutureDate
    ) {
      // Encontrar la venta inicial correspondiente a la categoría seleccionada
      const ventaInicial = this.ventas.find(
        (venta) => venta.categoria === this.selectedCategory?.categoria,
        // this.ventaInicial=venta.categoria
      )

      if (!ventaInicial) {
        // Si no se encuentra la venta inicial, establecer predictedSales a null y salir de la función
        this.predictedSales = null
        return
      }
      // this.ventaInicial=ventaInicial

      const fechaInicio = new Date(this.selectedStartDate)
      const fechaFutura = new Date(this.selectedFutureDate)

      const tiempoTranscurrido = Math.abs(
        fechaFutura.getTime() - fechaInicio.getTime(),
      )
      const diasHastaFechaFutura = Math.ceil(
        tiempoTranscurrido / (1000 * 60 * 60 * 24),
      )
      this.diasHastaFechaFutura = diasHastaFechaFutura
      // console.log('diasHastaFechaFutura:', diasHastaFechaFutura)

      if (diasHastaFechaFutura > 0) {
        // Calcular la tasa de crecimiento (k)
        // const k = this.calcularTasaCrecimiento(this.ventas, this.selectedStartDate, this.selectedFutureDate);
        // Dentro del método updatePredictions()
        const startDate = new Date(this.selectedStartDate)
        const futureDate = new Date(this.selectedFutureDate)
        const k = this.calcularTasaCrecimiento(
          this.ventas,
          startDate,
          futureDate,
        )

        // Predecir las ventas futuras utilizando la ecuación diferencial de crecimiento exponencial
        this.predictedSales = this.predecirVentasFuturas(
          ventaInicial,
          k,
          diasHastaFechaFutura,
        )
        this.predictedSales = Math.round(this.predictedSales)

        // console.log('predictedSales:', this.predictedSales)
      } else {
        this.predictedSales = null
      }

      this.chartData = {
        labels: ['Fecha actual', 'Fecha futura'],
        datasets: [
          {
            label: 'Ventas',
            data: [ventaInicial.cantidad, this.predictedSales || 0], // Asegurar que las ventas proyectadas no sean null
          },
        ],
      }

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
      }

      // console.log('chartData:', this.chartData)
      // console.log('chartOptions:', this.chartOptions)
    }
  }

  updateChartData(): void {
    const groupedSales: GroupedSales = this.ventas.reduce(
      (accumulator: GroupedSales, current) => {
        accumulator[current.fecha] =
          (accumulator[current.fecha] || 0) + current.cantidad
        return accumulator
      },
      {},
    )

    const chartDates = Object.keys(groupedSales)
    const chartQuantities = Object.values(groupedSales)

    const startDate = new Date(this.selectedStartDate)
    const futureDate = new Date(this.selectedFutureDate)

    // Filtrar las ventas entre la fecha inicial y la fecha futura
    const salesInRange = this.ventas.filter((venta) => {
      const ventaDate = new Date(venta.fecha)
      return ventaDate >= startDate && ventaDate <= futureDate
    })

    const groupedSalesInRange: GroupedSales = salesInRange.reduce(
      (accumulator: GroupedSales, current) => {
        accumulator[current.fecha] =
          (accumulator[current.fecha] || 0) + current.cantidad
        return accumulator
      },
      {},
    )

    const chartDatesInRange = Object.keys(groupedSalesInRange)
    const chartQuantitiesInRange = Object.values(groupedSalesInRange)

    this.chartData = {
      labels: chartDates,
      datasets: [
        {
          label: 'Ventas por fecha',
          data: chartQuantities,
          fill: false,
          borderColor: '#4caf50',
          tension: 0.1,
        },
      ],
    }

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM DD',
              },
            },
            scaleLabel: {
              display: true,
              labelString: 'Fecha',
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Cantidad',
            },
          },
        ],
      },
    }
  }

  updateChartFuturas(): void {
    if (this.selectedStartDate && this.selectedFutureDate) {
      const startDate = new Date(this.selectedStartDate)
      const futureDate = new Date(this.selectedFutureDate)

      const salesInRange = this.ventas.filter((venta) => {
        const ventaDate = new Date(venta.fecha)
        return ventaDate >= startDate && ventaDate <= futureDate
      })

      const groupedSalesInRange: GroupedSales = salesInRange.reduce(
        (accumulator: GroupedSales, current) => {
          accumulator[current.fecha] =
            (accumulator[current.fecha] || 0) + current.cantidad
          return accumulator
        },
        {},
      )

      const chartDatesInRange = Object.keys(groupedSalesInRange)
      const chartQuantitiesInRange = Object.values(groupedSalesInRange)

      this.chartDataFuturas = {
        labels: chartDatesInRange,
        datasets: [
          {
            label: 'Ventas en rango seleccionado',
            data: chartQuantitiesInRange,
            fill: false,
            borderColor: '#2196f3',
            tension: 0.1,
          },
        ],
      }

      this.chartOptionsFuturas = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM DD',
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'Fecha',
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Cantidad',
              },
            },
          ],
        },
      }
    }
  }
}
