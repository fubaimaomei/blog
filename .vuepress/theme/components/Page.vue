<template>
  <main class="page">
    <slot name="top" />

    <Content class="theme-default-content" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <Cute />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import Cute from "./Cute.vue";
export default {
  components: { PageEdit, PageNav, Cute },
  props: ["sidebarItems"]
};
</script>

<style lang="stylus">
$wrapper {
  max-width: $contentWidth;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  @media (max-width: $MQNarrow) {
    padding: 2rem;
  }
  @media (max-width: $MQMobileNarrow) {
    padding: 1.5rem;
  }
}
.page {
  padding-bottom: 2rem;
  display: block;
}
</style>