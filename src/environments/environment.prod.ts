export const environment = {
  production: true,
  aws: {
    cognito: {
      region: 'eu-central-1',
      identityPoolId: 'eu-central-1:aa76a979-9a8f-4b03-87d3-071912dfa53a',
      userPoolId: 'eu-central-1_CKVTc97Bh',
      clientId: '6io0eddih9f5g6are277kr65fq'
    },
    s3: {
      user: {
        region: 'us-east-2',
        bucket: 'app.prod.store'
      },
      provider: {
        region: 'us-east-2',
        bucket: 'provider.prod.store'
      }
    }
  },
  api: {
    url: 'https://api.tech-stm.net/prod'
  },
  skylink: {
    appKey: '9aaa8a58-c193-4569-bdba-940e5e9f3d31',
    secret: 'kmmzsqicvetdq'
  },
  endPoints: {
    freegeoip: 'https://freegeoip.net/json',
    restcountries: 'https://restcountries.eu/rest/v2/alpha'
  }
};
