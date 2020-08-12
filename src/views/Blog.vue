<template>
  <div class="blog">
    <h1>This is the blog page</h1>
    <ul class="list-group">
      <li v-for="blog in blogs" :key="blog.id" class="list-group-item">
        <a :href="blog.url" target="_blank"
          ><h5>{{ blog.title }}</h5></a
        >
        <div>
          <div class="text-muted">{{ blog.created }}</div>
          <br />
          <template v-for="tag in blog.tags">
            <span :key="tag" class="badge badge-dark"> {{ tag }} </span>&nbsp;
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.thumbnail {
  width: 100%;
  max-width: 150px;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";

interface Blog {
  id: number;
  title: string;
  desc: string;
  url: string;
  thumbnail: string;
  tags: string[];
  created: string;
}

export default defineComponent({
  name: "blog",
  async setup() {
    const responseDevTo = await fetch(
      "https://dev.to/api/articles?username=chenxeed"
    );
    const fromDevTo = await responseDevTo.json();
    const blogs: Blog[] = {
      ...fromDevTo.map((devToBlog: any) => {
        const blog: Blog = {
          id: devToBlog.id,
          title: devToBlog.title,
          desc: devToBlog.description,
          url: devToBlog.url,
          thumbnail: devToBlog.social_image,
          tags: devToBlog.tag_list,
          created: moment(devToBlog.created_at, "YYYY-MM-DD").fromNow()
        };
        return blog;
      })
    };
    return {
      blogs
    };
  }
});
</script>
