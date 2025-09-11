import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import './DataRetentionPolicyScreen.css';

const DataRetentionPolicyScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='data-retention-screen'>
      <div className='retention-header'>
        <motion.button
          className='back-button'
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Retour
        </motion.button>
        <h1>Politique de Rétention des Données</h1>
      </div>

      <div className='retention-container'>
        <motion.div
          className='retention-content'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Introduction */}
          <section className='retention-section'>
            <h2>📋 Vue d'ensemble</h2>
            <p>
              TeamUp, en tant que responsable de traitement, s'engage à respecter scrupuleusement le
              Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne. Cette
              politique de rétention des données définit de manière claire et transparente les durées
              de conservation de vos données personnelles, conformément aux articles 5.1.e et 32 du RGPD.
            </p>
            <div className='highlight-box'>
              <strong>Principe fondamental (Article 5.1.e RGPD) :</strong> Nous ne conservons vos
              données personnelles que le temps nécessaire à la réalisation des finalités pour
              lesquelles elles ont été collectées, dans le respect du principe de minimisation.
            </div>
            <p>
              Cette politique s'applique à toutes les données personnelles collectées par TeamUp,
              que ce soit directement auprès de vous ou par l'intermédiaire de nos services.
            </p>
          </section>

          {/* Types de données et durées */}
          <section className='retention-section'>
            <h2>⏰ Durées de Conservation</h2>

            <div className='data-category'>
              <h3>👤 Données de Profil Utilisateur</h3>
              <div className='retention-info'>
                <span className='duration'>3 ans d'inactivité</span>
                <div className='details'>
                  <p><strong>Finalité du traitement :</strong> Gestion de votre compte utilisateur et personnalisation du service</p>
                  <p><strong>Base légale :</strong> Exécution du contrat (Article 6.1.b RGPD)</p>
                  <p><strong>Données concernées :</strong></p>
                  <ul>
                    <li>Nom d'affichage et adresse email</li>
                    <li>Sports pratiqués et niveaux de compétence</li>
                    <li>Préférences et paramètres utilisateur</li>
                    <li>Date de création et dernière connexion</li>
                  </ul>
                  <p><strong>Critère de suppression :</strong> Aucune connexion depuis 3 ans consécutifs</p>
                  <p><strong>Justification :</strong> Délai raisonnable pour maintenir la continuité du service tout en respectant le principe de minimisation</p>
                </div>
              </div>
            </div>

            <div className='data-category'>
              <h3>💬 Messages de Chat</h3>
              <div className='retention-info'>
                <span className='duration'>2 ans</span>
                <div className='details'>
                  <p><strong>Finalité du traitement :</strong> Communication entre utilisateurs et fonctionnement du service de messagerie</p>
                  <p><strong>Base légale :</strong> Exécution du contrat et intérêt légitime (Articles 6.1.b et 6.1.f RGPD)</p>
                  <p><strong>Données concernées :</strong></p>
                  <ul>
                    <li>Contenu textuel des messages échangés</li>
                    <li>Horodatage précis des conversations</li>
                    <li>Identifiants des participants aux conversations</li>
                    <li>Métadonnées de communication (statuts de lecture, etc.)</li>
                  </ul>
                  <p><strong>Critère de suppression :</strong> Messages plus anciens que 2 ans à compter de leur envoi</p>
                  <p><strong>Justification :</strong> Durée nécessaire pour l'historique des conversations tout en limitant l'accumulation de données</p>
                </div>
              </div>
            </div>

            <div className='data-category'>
              <h3>🏃‍♂️ Événements Sportifs</h3>
              <div className='retention-info'>
                <span className='duration'>5 ans</span>
                <div className='details'>
                  <p><strong>Finalité du traitement :</strong> Organisation et gestion des événements sportifs, suivi des participations</p>
                  <p><strong>Base légale :</strong> Exécution du contrat (Article 6.1.b RGPD)</p>
                  <p><strong>Données concernées :</strong></p>
                  <ul>
                    <li>Informations détaillées des événements créés (titre, description, lieu, date)</li>
                    <li>Liste des participants et organisateurs</li>
                    <li>Historique complet de participation aux événements</li>
                    <li>Évaluations et commentaires post-événements</li>
                    <li>Données de géolocalisation des événements</li>
                  </ul>
                  <p><strong>Critère de suppression :</strong> Événements terminés depuis plus de 5 ans</p>
                  <p><strong>Justification :</strong> Conservation nécessaire pour l'historique des activités et les statistiques d'utilisation du service</p>
                </div>
              </div>
            </div>

            <div className='data-category'>
              <h3>🔐 Données d'Authentification</h3>
              <div className='retention-info'>
                <span className='duration'>Suppression immédiate</span>
                <div className='details'>
                  <p><strong>Finalité du traitement :</strong> Sécurisation de l'accès au service et gestion des sessions utilisateur</p>
                  <p><strong>Base légale :</strong> Intérêt légitime et obligation légale (Articles 6.1.f et 6.1.c RGPD)</p>
                  <p><strong>Données concernées :</strong></p>
                  <ul>
                    <li>Tokens d'authentification OAuth (Google)</li>
                    <li>Identifiants de session active</li>
                    <li>Données de connexion temporaires</li>
                    <li>Adresses IP de connexion (anonymisées après 24h)</li>
                  </ul>
                  <p><strong>Critère de suppression :</strong> Immédiatement lors de la déconnexion ou après 24h maximum</p>
                  <p><strong>Justification :</strong> Sécurité et respect du principe de minimisation - ces données n'ont pas de valeur historique</p>
                </div>
              </div>
            </div>

            <div className='data-category'>
              <h3>📊 Données Analytiques et Logs</h3>
              <div className='retention-info'>
                <span className='duration'>12 mois</span>
                <div className='details'>
                  <p><strong>Finalité du traitement :</strong> Amélioration du service, statistiques d'usage et sécurité</p>
                  <p><strong>Base légale :</strong> Intérêt légitime (Article 6.1.f RGPD)</p>
                  <p><strong>Données concernées :</strong></p>
                  <ul>
                    <li>Logs d'utilisation anonymisés</li>
                    <li>Métriques de performance</li>
                    <li>Données d'audit de sécurité</li>
                    <li>Statistiques d'usage agrégées</li>
                  </ul>
                  <p><strong>Critère de suppression :</strong> Après 12 mois de conservation</p>
                  <p><strong>Justification :</strong> Durée nécessaire pour l'analyse des tendances et la sécurité du service</p>
                </div>
              </div>
            </div>
          </section>

          {/* Processus de suppression */}
          <section className='retention-section'>
            <h2>🗑️ Processus de Suppression</h2>

            <div className='process-steps'>
              <div className='step'>
                <div className='step-number'>1</div>
                <div className='step-content'>
                  <h4>Identification Automatique</h4>
                  <p>Notre système identifie automatiquement les données éligibles à la suppression selon les critères définis.</p>
                </div>
              </div>

              <div className='step'>
                <div className='step-number'>2</div>
                <div className='step-content'>
                  <h4>Notification Préalable</h4>
                  <p>Vous recevez un email 30 jours avant la suppression définitive de vos données.</p>
                </div>
              </div>

              <div className='step'>
                <div className='step-number'>3</div>
                <div className='step-content'>
                  <h4>Suppression Sécurisée</h4>
                  <p>Les données sont supprimées de manière irréversible et sécurisée de tous nos systèmes.</p>
                </div>
              </div>

              <div className='step'>
                <div className='step-number'>4</div>
                <div className='step-content'>
                  <h4>Confirmation</h4>
                  <p>Vous recevez une confirmation de suppression avec la liste des données supprimées.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Exceptions et cas particuliers */}
          <section className='retention-section'>
            <h2>⚠️ Exceptions et Cas Particuliers</h2>

            <div className='exception-box'>
              <h4>📊 Données Anonymisées</h4>
              <p>
                Certaines données peuvent être conservées sous forme anonymisée pour des
                analyses statistiques et l'amélioration du service. Ces données ne permettent
                plus d'identifier les utilisateurs.
              </p>
            </div>

            <div className='exception-box'>
              <h4>⚖️ Obligations Légales</h4>
              <p>
                En cas d'obligation légale (procédure judiciaire, demande des autorités),
                certaines données peuvent être conservées plus longtemps selon les exigences légales.
              </p>
            </div>

            <div className='exception-box'>
              <h4>🔒 Sécurité</h4>
              <p>
                Les logs de sécurité et d'audit sont conservés 1 an pour assurer la
                sécurité de nos systèmes et détecter d'éventuelles intrusions.
              </p>
            </div>
          </section>

          {/* Actions utilisateur */}
          <section className='retention-section'>
            <h2>👥 Vos Droits RGPD</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
              des droits suivants concernant vos données personnelles :
            </p>

            <div className='user-rights'>
              <div className='right-item'>
                <h4>📋 Droit d'Accès (Article 15 RGPD)</h4>
                <p>Vous pouvez obtenir la confirmation que vos données personnelles sont traitées et accéder à ces données, ainsi qu'aux informations sur les finalités du traitement, les catégories de données concernées, et les destinataires.</p>
              </div>

              <div className='right-item'>
                <h4>✏️ Droit de Rectification (Article 16 RGPD)</h4>
                <p>Vous pouvez demander la correction de vos données personnelles inexactes ou l'ajout de données manquantes, directement depuis votre profil utilisateur.</p>
              </div>

              <div className='right-item'>
                <h4>🗑️ Droit à l'Effacement (Article 17 RGPD)</h4>
                <p>Vous pouvez demander la suppression de vos données personnelles, notamment lorsque les données ne sont plus nécessaires au regard des finalités pour lesquelles elles ont été collectées.</p>
              </div>

              <div className='right-item'>
                <h4>🚫 Droit à la Limitation (Article 18 RGPD)</h4>
                <p>Vous pouvez demander la limitation du traitement de vos données personnelles dans certaines circonstances, notamment en cas de contestation de l'exactitude des données.</p>
              </div>

              <div className='right-item'>
                <h4>📤 Droit à la Portabilité (Article 20 RGPD)</h4>
                <p>Vous pouvez recevoir vos données personnelles dans un format structuré et lisible par machine, et les transmettre à un autre responsable de traitement.</p>
              </div>

              <div className='right-item'>
                <h4>❌ Droit d'Opposition (Article 21 RGPD)</h4>
                <p>Vous pouvez vous opposer au traitement de vos données personnelles pour des motifs tenant à votre situation particulière, notamment pour des raisons de marketing direct.</p>
              </div>

              <div className='right-item'>
                <h4>⏰ Droit de Modification des Durées</h4>
                <p>Vous pouvez demander la modification des durées de conservation de vos données personnelles, sous réserve de justification légitime et de conformité aux obligations légales.</p>
              </div>

              <div className='right-item'>
                <h4>📧 Contrôle des Notifications</h4>
                <p>Vous pouvez gérer vos préférences concernant les notifications de suppression et autres communications liées à vos données personnelles.</p>
              </div>
            </div>

            <div className='highlight-box'>
              <strong>Exercice de vos droits :</strong> Pour exercer ces droits, contactez notre délégué à la protection des données
              à l'adresse dpo@teamup-app.com. Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum,
              conformément à l'article 12.3 du RGPD.
            </div>
          </section>

          {/* Informations techniques */}
          <section className='retention-section'>
            <h2>🔧 Informations Techniques et Conformité</h2>

            <div className='tech-info'>
              <h4>🕐 Horaires de Traitement</h4>
              <p>Les suppressions automatiques sont effectuées quotidiennement à 2h00 (heure UTC) pour minimiser l'impact sur les performances du service.</p>

              <h4>💾 Stockage et Localisation</h4>
              <p>Vos données sont stockées exclusivement sur des serveurs sécurisés situés en Europe (Union Européenne), conformément aux exigences du RGPD et aux décisions d'adéquation de la Commission Européenne.</p>

              <h4>🔐 Sécurité et Chiffrement</h4>
              <p>La suppression est effectuée de manière cryptographiquement sécurisée (algorithme AES-256) pour garantir l'irréversibilité totale. Toutes les données sont chiffrées en transit et au repos.</p>

              <h4>📝 Audit et Traçabilité</h4>
              <p>Toutes les opérations de suppression sont enregistrées dans nos logs d'audit avec horodatage, identifiant utilisateur et type de données supprimées, conformément aux exigences de traçabilité du RGPD.</p>

              <h4>🛡️ Mesures de Sécurité</h4>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées (Article 32 RGPD) incluant : contrôle d'accès, sauvegarde sécurisée, surveillance des systèmes, et formation du personnel.</p>

              <h4>📊 Analyse d'Impact (AIPD)</h4>
              <p>Une analyse d'impact relative à la protection des données (AIPD) a été réalisée conformément à l'article 35 du RGPD pour évaluer les risques liés au traitement de vos données personnelles.</p>

              <h4>🔄 Processus de Notification</h4>
              <p>En cas de violation de données personnelles susceptible d'engendrer un risque élevé, nous notifierons la CNIL dans les 72 heures et vous informerons sans délai, conformément aux articles 33 et 34 du RGPD.</p>
            </div>
          </section>

          {/* Conformité légale */}
          <section className='retention-section'>
            <h2>⚖️ Conformité Légale</h2>

            <div className='compliance-info'>
              <h4>📋 Base Légale du Traitement</h4>
              <p>
                Le traitement de vos données personnelles est fondé sur les bases légales suivantes,
                conformément à l'article 6 du RGPD :
              </p>
              <ul>
                <li><strong>Article 6.1.b :</strong> Exécution d'un contrat (utilisation du service TeamUp)</li>
                <li><strong>Article 6.1.f :</strong> Intérêt légitime (amélioration du service, sécurité)</li>
                <li><strong>Article 6.1.c :</strong> Obligation légale (conservation pour audit, sécurité)</li>
              </ul>

              <h4>🏛️ Autorité de Contrôle</h4>
              <p>
                Vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente
                (Commission Nationale de l'Informatique et des Libertés - CNIL) si vous estimez que le
                traitement de vos données personnelles constitue une violation du RGPD.
              </p>
              <p><strong>CNIL :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>

              <h4>📅 Révision de la Politique</h4>
              <p>
                Cette politique de rétention des données est révisée annuellement et mise à jour
                en cas de modification de nos pratiques ou d'évolution de la réglementation.
                Toute modification substantielle vous sera notifiée par email.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className='retention-section contact-section'>
            <h2>📞 Contact</h2>
            <p>
              Pour toute question concernant cette politique de rétention ou pour exercer vos droits,
              contactez notre délégué à la protection des données :
            </p>
            <div className='contact-info'>
              <p><strong>Email :</strong> dpo@teamup-app.com</p>
              <p><strong>Réponse :</strong> Sous 30 jours maximum</p>
              <p><strong>Langues :</strong> Français, Anglais</p>
            </div>
          </section>

          {/* Dernière mise à jour */}
          <div className='last-updated'>
            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
            <p><strong>Version :</strong> 1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataRetentionPolicyScreen;
