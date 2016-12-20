import convict from 'convict';


const config = convict({
    tfs: {
        collectionUrl: {
            doc:     'The TFS collection url.',
            default: 'https://fabrikam.visualstudio.com/defaultcollection',
            format:  String,
            env:     'TFS_COLLECTION_URL'
        },
        token: {
            doc:     'The TFS API token.',
            default: 'cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha',
            format:  String,
            env:     'TFS_API_TOKEN'
        }
    }
});


export default config;
