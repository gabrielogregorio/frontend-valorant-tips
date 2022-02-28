import { LINKS } from '@/data/links';
import { navbarEnum } from '@/enums/navbar';
import { Layout } from '@/layout/layout';
import { ContainerPosts } from '@/widgets/containerPosts';

const breadcrumbs = [LINKS.inicio, LINKS.Tested];

const Tested = () => (
  <Layout>
    <ContainerPosts
      breadcrumbs={breadcrumbs}
      type="tested"
      mode="public"
      typeSelected={navbarEnum.Tested}
      title="Posts para testar"
    />
  </Layout>
);
export default Tested;
