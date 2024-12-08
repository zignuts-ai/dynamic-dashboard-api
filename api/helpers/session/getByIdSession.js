const { sequelize } = require("../../models");



const getByIdSession = async (id) => {
    try {
        let sessionId = id
        if (!sessionId) {
          return ;
        }
        const query = `SELECT
      s.id AS "sessionId",
      s.name,
      s."userId",
      s.prompt,
      s.news,
      s.is_active,
      s.created_at,
      s.created_by,
      s.updated_at,
      s.updated_by,
      s.deleted_at,
      s.deleted_by,
      s.is_deleted,
      COALESCE(
          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'messageId', m.id,
                  'message', m.message,
                  'type', m.type,
                  'messageNews', m."messageNews",
                  'role', m.role,
                  'metadata', m.metadata,
                  'created_at', m.created_at,
                  'created_by', m.created_by
              )
          ) FILTER (WHERE m.id IS NOT NULL AND m.is_active = true ),
          '[]'::JSON
      ) AS messages
  FROM
      public.sessions s
  LEFT JOIN
      public.messages m
  ON
      s.id = m."sessionId"
      WHERE s.id = '${sessionId}'
  GROUP BY
      s.id;`;
        const session = await sequelize.query(query);
        // const session = await Session.findOne({ where: { id: sessionId } });
        if (!session?.[0]) {
          return 
        }

        return session?.[0]?.[0]
      } catch (error) {
        console.log("error: ", error);
        //return error response
        return 
      }
};

module.exports = {
    getByIdSession
}