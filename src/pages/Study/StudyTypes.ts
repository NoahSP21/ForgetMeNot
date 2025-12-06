export interface Unit {
    name: string;
  }
  
  export interface Subject {
    name: string;
    units: Unit[];
  }
  
  export interface StudyPlan {
    id?: string;
    title: string;
    subjects: Subject[];
  }
  