import { AnalysisInterface } from 'interfaces/analysis';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface QuestionInterface {
  id?: string;
  text: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  analysis?: AnalysisInterface[];
  user?: UserInterface;
  _count?: {
    analysis?: number;
  };
}

export interface QuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  text?: string;
  user_id?: string;
}
