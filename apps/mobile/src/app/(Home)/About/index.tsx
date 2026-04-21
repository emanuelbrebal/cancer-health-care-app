import { globalStyles } from '@/src/styles/global';
import { Colors } from '@/src/constants/Colors';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const TEAM = [
    { role: 'Orientador', name: 'Prof. Dr. Kristiana Cerqueira Mousinho', subtitle: undefined },
    { role: 'Estudante', name: 'Matheus Victor dos Santos', subtitle: 'Estudante de Farmácia — CESMAC' },
    { role: 'Estudante', name: 'Elayne Lúcia Silva de Oliveira', subtitle: 'Estudante de Farmácia — CESMAC' },
    { role: 'Desenvolvimento da plataforma', name: 'Emanuel Victor de Melo Brebal', subtitle: 'Estudante de Sistemas de Informação — CESMAC' },
];

export default function AboutScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scroll}>

            <View style={styles.logoSection}>
                <Image
                    source={require('@assets/images/icon.jpg')}
                    style={styles.mainLogo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>OncoMente</Text>
                <Text style={styles.version}>Versão 1.0.0</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Sobre o Projeto</Text>
                <Text style={styles.body}>
                    O OncoMente é um sistema de apoio a pacientes oncológicos e cuidadores, focado em saúde mental, adesão ao tratamento e combate ao estigma associado ao câncer.
                </Text>
                <Text style={styles.body}>
                    A plataforma democratiza o acesso ao conhecimento sobre prevenção e autocuidado, promovendo esperança na cura por meio de conteúdo informativo, acompanhamento gamificado e interação com mascote virtual com inteligência artificial.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Público-alvo</Text>
                <Text style={styles.body}>
                    Pacientes diagnosticados com câncer (qualquer tipo, gravidade ou idade) e seus cuidadores — acompanhantes e profissionais responsáveis pelo paciente.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Instituição</Text>
                <View style={styles.institutionRow}>
                    <Image
                        source={require('@assets/images/logos/cesmac-logo.png')}
                        style={styles.cesmacLogo}
                        resizeMode="contain"
                    />
                    <View style={styles.institutionTextBlock}>
                        <Text style={styles.institutionName}>CESMAC</Text>
                        <Text style={styles.institutionSubtitle}>
                            Centro Universitário CESMAC{'\n'}Maceió — Alagoas
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Equipe</Text>
                {TEAM.map((member, i) => (
                    <View key={i} style={styles.teamRow}>
                        <Text style={styles.teamRole}>{member.role}</Text>
                        <Text style={styles.teamName}>{member.name}</Text>
                        {member.subtitle ? <Text style={styles.teamSubtitle}>{member.subtitle}</Text> : null}
                    </View>
                ))}
            </View>



            <Text style={styles.footer}>
                © 2026 OncoMente · Todos os direitos reservados
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    mainLogo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginBottom: 12,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.purplePrimary,
        fontFamily: 'Montserrat',
    },
    version: {
        fontSize: 13,
        color: '#999',
        marginTop: 4,
        fontFamily: 'Montserrat',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.purpleSecondary,
        marginBottom: 10,
        fontFamily: 'Montserrat',
    },
    body: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
        marginBottom: 8,
        fontFamily: 'Montserrat',
    },
    institutionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    institutionTextBlock: {
        flex: 1,
    },
    institutionName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Montserrat',
    },
    institutionSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        lineHeight: 18,
        fontFamily: 'Montserrat',
    },
    cesmacLogo: {
        width: 60,
        height: 60,
    },
    teamRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    teamRole: {
        fontSize: 11,
        color: Colors.purplePrimary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'Montserrat',
    },
    teamName: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        marginTop: 2,
        fontFamily: 'Montserrat',
    },
    teamSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
        fontFamily: 'Montserrat',
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        color: '#BBB',
        marginTop: 8,
        fontFamily: 'Montserrat',
    },
});