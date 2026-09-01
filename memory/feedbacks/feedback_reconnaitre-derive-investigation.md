Quand une investigation technique enchaîne plusieurs hypothèses non vérifiées sur un point mineur sans
converger, s'arrêter et signaler l'état (ce qui a été éliminé, ce qui reste incertain, l'option de
documenter et avancer) — plutôt que d'enchaîner une hypothèse de plus en espérant que la suivante soit
la bonne.

**Why :** Sur War-Map Sahel (2026-07-05), un liseré blanc résiduel sur des frontières Mapbox a déclenché
3 tentatives de fix successives (reskin en continu via listener `sourcedata`, opacité forcée sur la
couche `-bg`, opacité forcée sur la couche `-disputed`) — chacune testée, aucune n'a résolu le problème,
sans qu'aucun signal d'arrêt ne soit proposé entre les tentatives. C'est Aziz qui a dû demander
explicitement "es-tu proche de la résolution ou rendu trop loin ?" pour que l'investigation s'arrête et
se documente. Le point était de toute façon mineur et non bloquant (validé a posteriori par Aziz :
"documenter et avancer").

**How to apply :** Après 2 tentatives de fix consécutives sur un même symptôme qui n'ont produit AUCUN
changement observable, faire le point avant une 3e tentative : lister ce qui a été éliminé avec
certitude, évaluer si le problème est bloquant pour l'objectif courant, et si non, proposer explicitement
l'option "documenter comme point ouvert + avancer" plutôt que de enchaîner une nouvelle hypothèse sans le
signaler. Ne pas attendre que l'utilisateur demande "es-tu proche ?" — le proposer avant.
