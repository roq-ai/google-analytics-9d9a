import { QuestionInterface } from 'interfaces/question';
import { GetQueryInterface } from 'interfaces';

export interface AnalysisInterface {
  id?: string;
  chart_data: string;
  question_id?: string;
  created_at?: any;
  updated_at?: any;

  question?: QuestionInterface;
  _count?: {};
}

export interface AnalysisGetQueryInterface extends GetQueryInterface {
  id?: string;
  chart_data?: string;
  question_id?: string;
}
