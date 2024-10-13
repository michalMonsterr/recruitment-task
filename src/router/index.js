// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import AddIntern from "@/components/AddIntern.vue";
import InternList from "@/components/InternList.vue";
import EditIntern from "@/components/EditIntern.vue";

const routes = [
  {
    path: "/",
    name: "InternList",
    component: InternList,
  },
  {
    path: "/add",
    name: "AddIntern",
    component: AddIntern,
  },
  {
    path: "/edit/:id",
    name: "EditIntern",
    component: EditIntern,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
