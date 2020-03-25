/* eslint-env node */
'use strict';

const moment = require('moment');
const truncate = require('lodash.truncate');
const path = require('path');
const fs = require('fs');
const yaml = require('yaml-front-matter');
const program = require('commander');
const chokidar = require('chokidar');
// Side effects:
// - Root node of JSON is files key mapping to a dictionary of files
// - .preview will be first WIDTH characters of the raw content
//   (not translated), if width is not 0
// - .__content is removed (potentially too large)
// - if .date is detected, a formated date is added as .dateFormatted

const processFile = function(filename, width, content) {
    const _basename = path.basename(filename, path.extname(filename));
    const content_type = filename.split("/");
    const contents = fs.readFileSync(filename, {encoding: 'utf-8'});
    const _metadata = yaml.loadFront(contents);

    // If width is truthy (is defined and and is not 0).
    if (width) {
        // Max of WIDTH chars snapped to word boundaries, trim whitespace
        const truncateOptions = {
            length: width,
            separator: /\s/,
            omission: ' …',
        };
        _metadata.preview = truncate(_metadata['__content'].trim(),
            truncateOptions);
    }

    // If the option is provided keep the entire content in field 'content'
    if (typeof(content) != 'undefined') {
        _metadata['content'] = _metadata['__content'];
    }

    delete _metadata['__content'];

    // map user-entered date to a better one using moment's great parser
    if (_metadata.date) {
        _metadata.iso8601Date = moment(_metadata.date).format();
    }

    _metadata.basename = _basename;
    return {
        metadata: _metadata,
        basename: _basename,
        content: content_type[content_type.length-2]

    };
};

const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    });

    return arrayOfFiles
};

const getFiles = function(filename) {
    if (fs.lstatSync(filename).isDirectory()) {

        return getAllFiles(filename);


    } else {
        return [filename];
    }
};

const startCmd = function(filenames,options){
    if(options.watch){
        chokidar.watch(filenames).on('all', (event, path) => {
            console.log(event, path);
           return parseStart(filenames,options);
        });
    }else{
       return parseStart(filenames,options)
    }
}

const parseStart = function(filenames, options) {



    const parseAllTheFiles = {
        lastModified: '',
        question_set: {}
    };

    let qLength = 0;
    const files = filenames
        .map(getFiles)
        .reduce((collection, filenames) => collection.concat(filenames), []);

    const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

    getDirectories(filenames[0]).forEach(item => {
        parseAllTheFiles['question_set'][item] = []
    });
    files
        .map((file) => processFile(file, options.width, options.content))
        .forEach((data) => {
            // parseAllTheFiles[data.basename] = data.metadata;
            parseAllTheFiles['question_set'][data.content].push(data.metadata);
            qLength++;
            // parseAllTheFiles[data.content][data.metadata.question_no.toString()] = data.metadata
        });
    parseAllTheFiles['lastModified'] = new Date().toISOString();
    parseAllTheFiles['qLength'] = qLength;
    const json = JSON.stringify(parseAllTheFiles, null, options.minify ? 0 : 2);

    if (options.outfile) {
        const file = fs.openSync(options.outfile, 'w+');
        fs.writeSync(file, json + '\n');
        fs.closeSync(file);

    } else if (options.localBuild){
        const file = fs.openSync('../src/assets/qbase.json', 'w+');
    fs.writeSync(file, json + '\n');
    fs.closeSync(file);

    }else {
        return json;
    }
};

program
    .version(require('../package.json').version)
    .usage('[options] <files>')
    .option('-w --width <int>',
        'max width of preview text [70]. Set to 0 for no preview',
        Number, 70)
    .option('-m --minify', 'format JSON without newlines')
    .option('-c --content', 'include full content')
    .option('-o --outfile <filename>', 'filename to save json to [output.json]')
    .option('-l --localbuild','Build JSON object to src/assets/')
    .option('-s --watch, Auto build when files changes')
    .parse(process.argv);

const options = {
    minify: program.minify,
    width: program.width,
    outfile: program.outfile,
    content: program.content,
    localBuild: program.localbuild,
    watch: program.watch,
};

// If there's no list of files to process, print usage and quit immediately
if (!program.args.length) {
    program.help();
}

const output = startCmd(program.args, options);
if (output) {
    process.stdout.write(output);
}