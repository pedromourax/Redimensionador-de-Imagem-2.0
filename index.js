const fs = require("fs")
const path = require("path")
const { argv } = require("process")
const sharp = require("sharp")
const underscore = require("underscore")

const caminhoDoProjeto = path.dirname(argv[1])

const diretorioArquivoBruto = path.join(caminhoDoProjeto, "Arquivo Bruto")

const getMaisRecente = (dir) => {
    const arquivos = fs.readdirSync(dir)
    return underscore.max(arquivos, function (a) {
        let fullpath = path.join(dir, a);
        return fs.statSync(fullpath).ctime;
    });
}

if (!fs.existsSync(diretorioArquivoBruto)) {
    fs.mkdirSync(diretorioArquivoBruto)
}

const redimensionados = path.join(caminhoDoProjeto, "Redimensionados")

if (!fs.existsSync(redimensionados)) {
    fs.mkdirSync(redimensionados)
}

const tamanhos = [128, 64, 32, 16]

if (typeof getMaisRecente(diretorioArquivoBruto) === "number") {
    console.log(`Insira as imagens em -> '${diretorioArquivoBruto}' e execute novamente... `)
}

else if (typeof getMaisRecente(diretorioArquivoBruto) === "string") {
    const [nomeDoArquivo, extensao] = path.basename(getMaisRecente(diretorioArquivoBruto)).split(".")
    const arquivoMaisRecente = path.join(diretorioArquivoBruto, `${getMaisRecente(diretorioArquivoBruto)}`)
    tamanhos.forEach(tamanho => {
        sharp(arquivoMaisRecente)
            .resize({ width: tamanho, height: tamanho })
            .toFile(path.join(redimensionados, `${nomeDoArquivo}-${tamanho}.${extensao}`))
            .then(info => { console.log(info) })
            .catch(error => { console.log(error) })
    })
    console.log("Arquivo redimensionado!")
}

else {
    console.log(`Diretórios criados! Insira as imagens em -> '${diretorioArquivoBruto}' e execute novamente... `)
}

