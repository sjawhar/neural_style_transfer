import VueRouter from 'vue-router';

// Layouts
import FeedPage from '@/components/FeedPage';
import LandingLayout from '@/components/LandingLayout';
import RequestPage from '@/components/RequestPage';

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
        component: RequestPage,
      },
      {
        path: 'feed',
        name: 'feed',
        component: FeedPage,
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
