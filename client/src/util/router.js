import VueRouter from 'vue-router';

// Layouts
import Feed from '@/components/FeedPage';
import LandingLayout from '@/components/LandingLayout';
import NotFound from '@/components/NotFoundPage';
import Request from '@/components/RequestPage';

const routes = [
  {
    path: '/',
    component: LandingLayout,
    children: [
      {
        path: '',
        name: 'root',
        redirect: 'request',
      },
      {
        path: 'request',
        name: 'request',
        component: Request,
      },
      {
        path: 'feed',
        name: 'feed',
        component: Feed,
      },
    ],
  },
  { path: '*', component: NotFound },
];

// configure router
export default new VueRouter({
  linkActiveClass: 'active',
  // mode: 'history',
  routes,
});
