OSM.Entity.prototype.getImage = function() {
    return "";
}

OSM.Node.prototype.getImage = function() {
    return 'img/Node.png';
}

OSM.Way.prototype.getImage = function() {
    return (this.isClosed()) ? 'img/Area.png' : 'img/Way.png';
}

OSM.Relation.prototype.getImage = function() {
    return 'img/Relation.png';
}

Application.View = {};