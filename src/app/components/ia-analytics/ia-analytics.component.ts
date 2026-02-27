

import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import {PredictionResult} from "../../models/prediction.model";
import {IaAnalysisService} from "../../services/ia-analysis.service";

@Component({
  selector: 'app-ia-analytics',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './ia-analytics.component.html',
  styleUrls: ['./ia-analytics.component.css']
})
export class IaAnalyticsComponent implements OnInit {
  predictions: PredictionResult[] = [];
  chargement = true;

  constructor(private iaService: IaAnalysisService) {}

  ngOnInit(): void {
    this.iaService.getAnalyseStock().subscribe({
      next: (data) => {
        this.predictions = data;
        this.chargement = false;
      },
      error: () => this.chargement = false
    });
  }

  getConfianceColor(score: number): string {
    if (score > 0.8) return '#198754'; // Succès
    if (score > 0.5) return '#ffc107'; // Attention
    return '#dc3545'; // Danger
  }
}
