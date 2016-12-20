import request from 'superagent-bluebird-promise';
import Promise from 'bluebird';
import _       from 'lodash';
import chalk   from 'chalk';
import config  from './config';
import tfs     from 'vso-node-api';
import * as ba from 'vso-node-api/BuildApi';
import * as bi from 'vso-node-api/interfaces/BuildInterfaces';


/**
 * @param {Mozaik} mozaik
 */
const client = mozaik => {

    mozaik.loadApiConfig(config);

    const buildApiRequest = () => {
        const url = config.get('tfs.collectionurl'); 
        mozaik.logger.info(chalk.yellow(`[tfs] connecting to ${url}`));
	    let authHandler = tfs.getPersonalAccessTokenHandler(config.get('tfs.token')); 
        let connect = new tfs.WebApi(url, authHandler);
        return connect;
    };

    const repositoryCommits = (params, buffer) => {
        return buildApiRequest().getProjectHistory();
    };

    const apiCalls = {

        
        repositoryBuildResults(params){
            let vsts = buildApiRequest();
            let vstsBuild = vsts.getBuildApi();

            // list definitions
            //cm.heading('Build Definitions for ' + project);
            let defs = vstsBuild.getDefinitions(params.project);
            
            console.log('You have ' + defs.length + ' build definition(s)');
            for (let i = 0; i < defs.length; i++) {
                let defRef = defs[i];
                let def = vstsBuild.getDefinition(defRef.id, params.project);
                let rep = def.repository;

                console.log(defRef.name + ' (' + defRef.id + ') ' + 'repo ' + rep.type);            
            }

            // get top 25 successfully completed builds since 2016
            //cm.heading('top 25 successfully completed builds for ' + project + 'project');
            let builds= vstsBuild.getBuilds(
                            params.project, 
                            null,                       // definitions: number[] 
                            null,                       // queues: number[]
                            null,                       // buildNumber
                            null, //new Date(2016, 1, 1),       // minFinishTime
                            null,                       // maxFinishTime
                            null,                       // requestedFor: string
                            bi.BuildReason.All,         // reason
                            bi.BuildStatus.Completed,
                            bi.BuildResult.Succeeded,
                            null,                       // tagFilters: string[]
                            null,                        // properties: string[]
                            //bi.DefinitionType.Build,
                            25                          // top: number
                            );
            
            
            //console.log(builds.length + ' builds returned');
            builds.forEach((build) => {
                //console.log(build.buildNumber, bi.BuildResult[build.result], 'on', build.finishTime.toDateString());
            });
        },

        repositoryContributorsStats(params) {
            return buildApiRequest()
                .then(res => res.body)
            ;
        },

        repositoryCommits(params) {
            return buildApiRequest().getChangesets(
                null, //project name : string
                null, //max comment length : number
                null, //skip : number
                null, //top : number
                null, //orderby : string
                null //searchCriteria?: TfvcInterfaces.TfvcChangesetSearchCriteria
            )
        },

        issues(params) {
            return buildApiRequest()
                .then(res => res.body)
            ;
        },

        // Be warned that this API call can be heavy enough
        // because it fetch all the issues for each labels
        issueLabelsAggregations(params) {
            return buildApiRequest().getWorkItems(
                [1,2],//ids: number[], 
                null,//fields?: string[], 
                null,//asOf?: Date, 
                null//expand?: WorkItemTrackingInterfaces.WorkItemExpand
            );
        },

        status() {
            const url = 'https://status.github.com/api/last-message.json';
            let req   = request.get(url);

            mozaik.logger.info(chalk.yellow(`[github] calling ${url}`));

            return req.promise()
                .then(res => res.body)
            ;
        }
    };

    return apiCalls;
};


export default client;
