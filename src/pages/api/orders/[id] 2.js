const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
  const session = await getSession({ req, req });
};
