import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataRetentionPolicyScreenTest: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <button
          onClick={handleBack}
          style={{
            background: '#3b5bdb',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          ← Retour
        </button>

        <h1 style={{ color: '#3b5bdb', marginBottom: '2rem' }}>
          Politique de Rétention des Données
        </h1>

        <div style={{ lineHeight: '1.6', color: '#555' }}>
          <h2>📋 Vue d'ensemble</h2>
          <p>
            TeamUp, en tant que responsable de traitement, s'engage à respecter scrupuleusement le
            Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne. Cette
            politique de rétention des données définit de manière claire et transparente les durées
            de conservation de vos données personnelles, conformément aux articles 5.1.e et 32 du RGPD.
          </p>

          <div style={{
            background: '#e8ecff',
            border: '2px solid #3b5bdb',
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '1.5rem 0'
          }}>
            <strong>Principe fondamental (Article 5.1.e RGPD) :</strong> Nous ne conservons vos
            données personnelles que le temps nécessaire à la réalisation des finalités pour
            lesquelles elles ont été collectées, dans le respect du principe de minimisation.
          </div>

          <h2>⏰ Durées de Conservation</h2>

          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '12px',
            borderLeft: '4px solid #3b5bdb'
          }}>
            <h3>👤 Données de Profil Utilisateur</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <span style={{
                background: '#28a745',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                3 ans d'inactivité
              </span>
              <div style={{ flex: 1 }}>
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

          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '12px',
            borderLeft: '4px solid #3b5bdb'
          }}>
            <h3>💬 Messages de Chat</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <span style={{
                background: '#28a745',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                2 ans
              </span>
              <div style={{ flex: 1 }}>
                <p><strong>Finalité du traitement :</strong> Communication entre utilisateurs et fonctionnement du service de messagerie</p>
                <p><strong>Base légale :</strong> Exécution du contrat et intérêt légitime (Articles 6.1.b et 6.1.f RGPD)</p>
                <p><strong>Critère de suppression :</strong> Messages plus anciens que 2 ans à compter de leur envoi</p>
                <p><strong>Justification :</strong> Durée nécessaire pour l'historique des conversations tout en limitant l'accumulation de données</p>
              </div>
            </div>
          </div>

          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '12px',
            borderLeft: '4px solid #3b5bdb'
          }}>
            <h3>🏃‍♂️ Événements Sportifs</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <span style={{
                background: '#28a745',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                5 ans
              </span>
              <div style={{ flex: 1 }}>
                <p><strong>Finalité du traitement :</strong> Organisation et gestion des événements sportifs, suivi des participations</p>
                <p><strong>Base légale :</strong> Exécution du contrat (Article 6.1.b RGPD)</p>
                <p><strong>Critère de suppression :</strong> Événements terminés depuis plus de 5 ans</p>
                <p><strong>Justification :</strong> Conservation nécessaire pour l'historique des activités et les statistiques d'utilisation du service</p>
              </div>
            </div>
          </div>

          <h2>👥 Vos Droits RGPD</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            des droits suivants concernant vos données personnelles :
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              background: '#e8ecff',
              borderRadius: '12px',
              border: '2px solid #3b5bdb'
            }}>
              <h4>📋 Droit d'Accès (Article 15 RGPD)</h4>
              <p>Vous pouvez obtenir la confirmation que vos données personnelles sont traitées et accéder à ces données.</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#e8ecff',
              borderRadius: '12px',
              border: '2px solid #3b5bdb'
            }}>
              <h4>✏️ Droit de Rectification (Article 16 RGPD)</h4>
              <p>Vous pouvez demander la correction de vos données personnelles inexactes.</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#e8ecff',
              borderRadius: '12px',
              border: '2px solid #3b5bdb'
            }}>
              <h4>🗑️ Droit à l'Effacement (Article 17 RGPD)</h4>
              <p>Vous pouvez demander la suppression de vos données personnelles.</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#e8ecff',
              borderRadius: '12px',
              border: '2px solid #3b5bdb'
            }}>
              <h4>📤 Droit à la Portabilité (Article 20 RGPD)</h4>
              <p>Vous pouvez recevoir vos données dans un format structuré et lisible.</p>
            </div>
          </div>

          <div style={{
            background: '#e8ecff',
            border: '2px solid #3b5bdb',
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '2rem 0'
          }}>
            <strong>Exercice de vos droits :</strong> Pour exercer ces droits, contactez notre délégué à la protection des données
            à l'adresse dpo@teamup-app.com. Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum,
            conformément à l'article 12.3 du RGPD.
          </div>

          <h2>📞 Contact</h2>
          <p>
            Pour toute question concernant cette politique de rétention ou pour exercer vos droits,
            contactez notre délégué à la protection des données :
          </p>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '1rem',
            border: '1px solid #ddd'
          }}>
            <p><strong>Email :</strong> dpo@teamup-app.com</p>
            <p><strong>Réponse :</strong> Sous 30 jours maximum</p>
            <p><strong>Langues :</strong> Français, Anglais</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            textAlign: 'center',
            marginTop: '2rem',
            borderTop: '1px solid #e9ecef'
          }}>
            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
            <p><strong>Version :</strong> 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetentionPolicyScreenTest;
