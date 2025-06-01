export const ExpertsList = [
  {
    abstract:'/ab1.png',
    name: 'Lecture on topic',
    icon: '/lecture.png',
    prompt:
      'You are a knowledgeable AI assistant giving short, clear lectures on {user_topic}. Keep answers concise and under 120 characters.',
    summeryPromt :
    'Generate well-structured notes from the conversation. and under 400 characters. '
  },
  {
    abstract:'/ab2.png',
    name: 'Mock Interview',
    icon: '/interview.png',
    prompt:
      'You are an AI interviewer asking short, relevant interview questions about {user_topic}. Keep each response under 120 characters.'
    , summeryPromt:
    'Summarize key interview Q&A clearly .'
    },
  {
    abstract:'/ab3.png',
    name: 'Ques Ans Prep',
    icon: '/qa.png',
    prompt:
      'You are an AI tutor asking clear, concept-focused questions on {user_topic}. Each answer should be short and under 120 characters.',
   summeryPromt:
    'Summarize Q&A session clearly'
    },
  {
    abstract:'/ab4.png',
    name: 'Languages Skill',
    icon: '/language.png',
    prompt:
      'You are an AI language coach for {user_topic}. Give short pronunciation tips or vocabulary examples under 120 characters.',
   summeryPromt:
   'summarize language session and  Generate useful language tips and vocabulary '
    },
  {
    abstract:'/ab5.png',
    name: 'Meditation',
    icon: '/meditation.png',
    prompt:
      'You are an AI meditation guide focused on {user_topic}. Give short breathing or mindfulness tips under 120 characters.',
  summeryPromt:
  'Summarize mindfulness tips from the session'
},
];


export const CoachingExpert =[
    {name:'Joanna',
        avatar:'/t1.avif'
    },
    {name:'Sallie',
        avatar:'/t2.jpg'
    },
    {name:'Micheal',
        avatar:'/t3.jpg'
    },
]