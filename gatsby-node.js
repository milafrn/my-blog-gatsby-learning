const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)



// To add the slug field to each post
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({
      node,
      getNode,
      basePath: "pages",
    })

    // Creates new query'able field with name of 'slug'
    createNodeField({
      node,
      name: "slug",
      value: `/${slug.slice(12)}`,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
     result.data.allMarkdownRemark.edges.forEach(({node}) => {
       createPage({
         path: node.fields.slug,
         component: path.resolve('./src/templates/blog-post.js'),
         context: {
           slug: node.fields.slug
         }
       })
     })
  })
}