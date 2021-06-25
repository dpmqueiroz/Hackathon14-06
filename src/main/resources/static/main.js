function fazGet(url,pagina){
    let request = new XMLHttpRequest();
    request.open("GET", url+"?page="+pagina+"&size=10", false);
    request.send();
    return request;
}

function fazPost(url, body){
    let request = new XMLHttpRequest();
    request.open("POST", url, false);
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(body));
    return request;
}

function fazPut(url, body){
    let request = new XMLHttpRequest();
    request.open("PUT", url, false);
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(body));
    return request;
}

function refazerTabela(){

    let tabela = document.getElementById("tabelaUniversidades");
    let tHead = document.createElement("thead");
    tHead.classList ="thead-dark";

    let linhaCabecalho = document.createElement("tr");
    let thCodigo = document.createElement("th");
    let thNome = document.createElement("th");
    let thSigla = document.createElement("th");
    let thAcao = document.createElement("th");

    thCodigo.setAttribute("scope","col");
    thCodigo.classList = "text-center";
    thCodigo.textContent = "Código";
    linhaCabecalho.appendChild(thCodigo)
    
    thNome.setAttribute("scope","col");
    thNome.classList = "text-center";
    thNome.textContent = "Nome";
    linhaCabecalho.appendChild(thNome);

    thSigla.setAttribute("scope","col");
    thSigla.classList = "text-center";
    thSigla.textContent = "Sigla";
    linhaCabecalho.appendChild(thSigla);

    thAcao.setAttribute("scope","col");
    thAcao.classList = "text-center";
    thAcao.textContent = "Ação";
    linhaCabecalho.appendChild(thAcao);

    tHead.appendChild(linhaCabecalho);

    tabela.appendChild(tHead);
}

function criarLinha(usuario){
    let linha = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdSigla = document.createElement("td");
    let tdAcoes = document.createElement("td");
    let linkDeletar = document.createElement("button");
    let linkAtualizar = document.createElement("button");


    linkDeletar.type = "button";

    
    linkDeletar.innerHTML = "Deletar";
    linkDeletar.classList = "btn btn-danger"
    linkAtualizar.innerHTML = "Atualizar";
    linkAtualizar.type = "button";
    linkAtualizar.classList = "btn btn-warning";
    linkAtualizar.setAttribute("data-toggle","modal")
    linkAtualizar.setAttribute("data-target","#ModalAtualizar")
    tdId.classList = "text-center";
    tdSigla.classList = "text-center";
    tdAcoes.classList = "text-center";
    tdId.innerHTML = usuario.id;
    tdNome.innerHTML = usuario.nome;
    tdSigla.innerHTML = usuario.sigla;
    
    //METODO PARA DELETAR
    linkDeletar.onclick = function (){
    let request = new XMLHttpRequest();
    request.open("DELETE","http://localhost:8080/universidades/"+usuario.id , false);
    request.send();
    location.reload();
    return request;
    };

    //METODO PARA ATUALIZAR
    linkAtualizar.onclick = function (){
        let attnome = document.getElementById("instNomeAtu");
        let attsigla = document.getElementById("instSiglaAtu");
        let labelcodigo = document.getElementById("labelcodigoatt")
        attnome.value = usuario.nome;
        attsigla.value = usuario.sigla;
        labelcodigo.innerHTML = usuario.id;
    }

    tdAcoes.appendChild(linkDeletar)
    tdAcoes.appendChild(linkAtualizar)
    linha.appendChild(tdId);
    linha.appendChild(tdNome);
    linha.appendChild(tdSigla);
    linha.appendChild(tdAcoes)

    return linha;
}

function main(pagina){
    let data = fazGet("http://localhost:8080/universidades",pagina).responseText;
    let usuarios = JSON.parse(data);

    let tabela = document.getElementById("tabelaUniversidades");

    let proximo = document.getElementById("btnProximo");
    usuarios.last == false ? proximo.parentNode.classList = "page-item" : proximo.parentNode.classList = "page-item disabled";




    //******************************************************************************** Método para remover as linhas da tabela para buscar a outra página */
    while(tabela.hasChildNodes()){
        tabela.removeChild(tabela.lastChild);
    }

    refazerTabela();
    

    usuarios.content.forEach(usuario => {
        let linha = criarLinha(usuario);
        tabela.appendChild(linha);
    });
};

function mainAvancar(pagina){
    let data = fazGet("http://localhost:8080/universidades",pagina).responseText;
    let usuarios = JSON.parse(data);

    let tabela = document.getElementById("tabelaUniversidades");
    let anterior = document.getElementById("btnAnterior");
    let proximo = document.getElementById("btnProximo");
    let btnpagina = document.getElementById("btnPagina");

    usuarios.first == false ? anterior.parentNode.classList = "page-item" : anterior.parentNode.classList = "page-item disabled";
    usuarios.last == false ? proximo.parentNode.classList = "page-item" : proximo.parentNode.classList = "page-item disabled";

    anterior.setAttribute("onclick","mainAvancar("+(pagina - 1)+")")
    proximo.setAttribute("onclick","mainAvancar("+(++pagina)+")")
    btnpagina.innerText = (usuarios.first == true) ? ((usuarios.last == true) ? (pagina) : ((pagina)+"...")): (usuarios.last == true) ?("..."+(pagina)) : ("..."+(pagina)+"...") ;


    //******************************************************************************** Método para remover as linhas da tabela para buscar a outra página */
    while(tabela.hasChildNodes()){
        tabela.removeChild(tabela.firstChild);
    }
    refazerTabela();

    usuarios.content.forEach(usuario => {
        let linha = criarLinha(usuario);
        tabela.appendChild(linha);
    });
};

function mainRetroceder(pagina){
    let data = fazGet("http://localhost:8080/universidades",pagina).responseText;
    let usuarios = JSON.parse(data);

    let tabela = document.getElementById("tabelaUniversidades");
    let anterior = document.getElementById("btnAnterior");
    let proximo = document.getElementById("btnProximo");
    let btnpagina = document.getElementById("btnPagina");

    usuarios.first == false ? anterior.parentNode.classList = "page-item" : anterior.parentNode.classList = "page-item disabled";
    usuarios.last == false ? proximo.parentNode.classList = "page-item" : proximo.parentNode.classList = "page-item disabled";

    anterior.setAttribute("onclick","mainAvancar("+(pagina - 1)+")")
    proximo.setAttribute("onclick","mainAvancar("+(++pagina)+")")
    btnpagina.innerText = (usuarios.first == true) ? ((usuarios.last == true) ? (pagina) : ((pagina)+"...")): (usuarios.last == true) ?("..."+(pagina)) : ("..."+(pagina)+"...") ;

    //******************************************************************************** Método para remover as linhas da tabela para buscar a outra página */
    while(tabela.hasChildNodes()){
        tabela.removeChild(tabela.firstChild);
    }
    refazerTabela();

    usuarios.content.forEach(usuario => {
        let linha = criarLinha(usuario);
        tabela.appendChild(linha);
    });
};




function cadastrarUniversidade(){
    event.preventDefault();
    let url = "http://localhost:8080/universidades";
    let nome = document.getElementById("instNome").value;
    let sigla = document.getElementById("instSigla").value;
  
    let body = {
        "nome": nome,
        "sigla": sigla
    };

    console.log(fazPost(url, body).responseText);
    location.reload();
}

function atualizarUniversidade(){
    event.preventDefault();
    let nome = document.getElementById("instNomeAtu").value;
    let sigla = document.getElementById("instSiglaAtu").value;
    let labelcodigo = document.getElementById("labelcodigoatt").textContent;
    let url = "http://localhost:8080/universidades/"+labelcodigo;
    let body = {
        "nome": nome,
        "sigla": sigla
    };
    console.log(fazPut(url,body).responseText);
    location.reload();
}

main();